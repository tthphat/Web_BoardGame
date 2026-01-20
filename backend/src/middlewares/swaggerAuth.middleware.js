import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service.js';

const HTML_FORM = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Docs Login</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
    </style>
</head>
<body class="bg-[#2d2d2d] h-screen flex items-center justify-center font-['JetBrains_Mono']">
    <div class="w-96 bg-[#c0c0c0] p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-600 shadow-2xl">
        
        <!-- Header -->
        <div class="bg-blue-900 px-2 py-1 flex justify-between items-center mb-4">
            <h2 class="text-white font-bold text-sm">System Login - API Docs</h2>
            <div class="flex gap-1">
                <div class="w-3 h-3 bg-gray-300 border border-gray-600"></div>
                <div class="w-3 h-3 bg-gray-300 border border-gray-600"></div>
            </div>
        </div>

        <div class="p-6">
            <form action="/docs-login" method="POST" class="space-y-6">
                <div>
                    <label class="block text-black text-xs font-bold mb-1 uppercase">Email Address:</label>
                    <input type="email" name="email" required 
                        class="w-full bg-white text-black border-2 border-gray-600 border-b-white border-r-white p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-900">
                </div>
                
                <div>
                    <label class="block text-black text-xs font-bold mb-1 uppercase">Password:</label>
                    <input type="password" name="password" required 
                        class="w-full bg-white text-black border-2 border-gray-600 border-b-white border-r-white p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-900">
                </div>

                <div class="flex justify-end pt-2">
                    <button type="submit" 
                        class="bg-[#c0c0c0] text-black font-bold text-sm px-6 py-2 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-600 active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-whiteactive:translate-y-0.5 hover:bg-gray-300 transition-colors uppercase">
                        Authenticate
                    </button>
                </div>
            </form>
            
            <div id="error-msg" class="hidden mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-xs font-bold text-center uppercase">
                 Access Denied: Invalid Credentials
            </div>
        </div>
    </div>

    <script>
        if (window.location.search.includes('error=1')) {
            document.getElementById('error-msg').classList.remove('hidden');
        }
    </script>
</body>
</html>
`;

export const swaggerLoginView = (req, res) => {
    // If already logged in, redirect to docs
    if (req.cookies && req.cookies.docs_token) {
        return res.redirect('/api-docs');
    }
    res.send(HTML_FORM);
};

export const swaggerLoginAction = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await AuthService.login(email, password);

        const token = result?.data?.token;

        if (token) {
            // Set httpOnly cookie for docs access
            res.cookie('docs_token', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'lax', // Allow redirect flow
                secure: process.env.NODE_ENV === 'production'
            });
            return res.redirect('/api-docs');
        } else {
            throw new Error("No token returned");
        }
    } catch (error) {
        return res.redirect('/docs-login?error=1');
    }
};

export const swaggerProtect = (req, res, next) => {
    const token = req?.cookies?.docs_token;

    if (!token) {
        return res.redirect('/docs-login');
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.clearCookie('docs_token');
        return res.redirect('/docs-login');
    }
};
