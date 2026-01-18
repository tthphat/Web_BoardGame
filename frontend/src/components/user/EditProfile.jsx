import { SquarePen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { editProfileApi } from "@/services/user.service";
import { useState } from "react";
import { editProfileSchema } from "@/lib/editProfile.schema";
import { toast } from "sonner";

function EditProfile({ data, field, onSuccess }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(data || "");
    // Separate states for password flow
    const [oldPassword, setOldPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async () => {
        setError("");

        let payload = {};
        if (field === "password") {
            // Force both fields to be present
            if (!oldPassword || !value) {
                setError("Both old and new passwords are required");
                return;
            }
            payload = {
                oldPassword,
                password: value,
            };
        } else {
            // Check if value actually changed
            if (value === data) {
                setError(`New ${field} must be different from current ${field}`);
                return;
            }
            payload = { [field]: value };
        }

        // Validate using schema
        const result = editProfileSchema.safeParse(payload);
        if (!result.success) {
            const errorMessage = result.error.issues[0].message || "Validation failed";
            setError(errorMessage);
            return;
        }

        setLoading(true);
        try {
            await editProfileApi(payload);
            toast.success(`Profile ${field} updated successfully`);
            setOpen(false);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setValue(data || "");
        setOldPassword("");
        setError("");
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (val) resetForm();
        }}>
            <DialogTrigger asChild>
                <SquarePen className="w-5 h-5 cursor-pointer hover:text-retro-navy transition-colors" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-secondary-background border-2 border-primary-border border-b-white border-r-white">
                <DialogHeader>
                    <DialogTitle className="font-mono text-primary-text uppercase text-xl">Edit {field}</DialogTitle>
                    <DialogDescription className="font-mono text-primary-text opacity-70">
                        {field === "password" ? "Enter your current and new password." : `Enter your new ${field} below.`}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    {field === "password" ? (
                        <>
                            <div className="flex flex-col gap-2">
                                <label className="font-mono text-xs uppercase text-primary-text">Old Password</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full p-2 border-2 border-primary-border bg-white dark:bg-[#1a1a1a] text-primary-text font-mono focus:outline-none"
                                    placeholder="Current password"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-mono text-xs uppercase text-primary-text">New Password</label>
                                <input
                                    type="password"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="w-full p-2 border-2 border-primary-border bg-white dark:bg-[#1a1a1a] text-primary-text font-mono focus:outline-none"
                                    placeholder="New password"
                                />
                            </div>
                        </>
                    ) : (
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full p-2 border-2 border-primary-border bg-white dark:bg-[#1a1a1a] text-primary-text font-mono focus:outline-none"
                            placeholder={`Enter new ${field}`}
                        />
                    )}
                    {error && <p className="text-red-600 dark:text-red-400 text-xs font-mono font-bold leading-relaxed">{error}</p>}
                </div>

                <div className="flex gap-3">
                    <DialogClose asChild>
                        <button className="flex-1 p-2 border-2 border-primary-border border-b-white border-r-white bg-retro-silver hover:bg-gray-300 font-mono text-sm uppercase">
                            Cancel
                        </button>
                    </DialogClose>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 p-2 border-2 border-primary-border border-t-white border-l-white bg-retro-navy text-white hover:bg-opacity-90 font-mono text-sm uppercase disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default EditProfile;
