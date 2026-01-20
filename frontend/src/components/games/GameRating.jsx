import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
            <DialogContent className="sm:max-w-[600px] bg-[#e0e0e0] dark:bg-[#2d2d2d] border-4 border-black font-mono p-0 overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Rate Game</DialogTitle>
                </DialogHeader>
                <GameRatingContent gameSlug={gameSlug} gameName={gameName} />
            </DialogContent>
        </Dialog>
    );
};

export default GameRating;
