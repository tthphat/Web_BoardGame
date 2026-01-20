import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription // 1. Import thêm cái này
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import GameRatingContent from './GameRatingContent';

const GameRating = ({ gameSlug, gameName }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="bg-[#c0c0c0] dark:bg-[#3d3d3d] border-2 border-b-4 border-r-4 border-black dark:border-black active:border-b-2 active:border-r-2 active:translate-y-1 transition-all"
                >
                    <Star className="mr-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
                    Rate Game
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] bg-[#e0e0e0] dark:bg-[#2d2d2d] border-4 border-black font-mono p-0 overflow-hidden gap-0">
                {/* 2. Thêm DialogHeader để chứa Title và Description */}
                <DialogHeader className="space-y-0 text-left">

                    {/* 3. Dùng DialogTitle làm thanh tiêu đề xanh (Retro Window Bar) */}
                    <DialogTitle className="bg-[#000080] text-white px-3 py-1.5 font-bold text-sm uppercase tracking-wider flex items-center gap-2 select-none border-b-2 border-black">
                        <Star className="h-3 w-3 fill-white text-white" />
                        RATE_GAME.EXE
                    </DialogTitle>

                    {/* 4. Thêm Description nhưng ẩn đi để fix lỗi warning */}
                    <DialogDescription className="sr-only">
                        Popup window to rate and review the game {gameName}
                    </DialogDescription>

                </DialogHeader>

                {/* Phần nội dung chính */}
                <div className="p-4">
                    <GameRatingContent gameSlug={gameSlug} gameName={gameName} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GameRating;