import React, { FC, useState } from 'react';
import { Users, Share2 } from 'lucide-react';
import { Button } from "../components/ui/button";

interface HeaderProps {
    title?: string;
    description?: string;
    shareText?: {
        default: string;
        copied: string;
    };
    onShare: () => void;
}

const Header: FC<HeaderProps> = ({
    title = 'Invite Collaborators',
    description = 'Share access with your team members, clients, or friends to collaborate on this project.',
    shareText = { default: 'Share Link', copied: 'Copied!' },
    onShare,
}) => {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        onShare();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <header className="bg-white rounded-lg py-12 border-b">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-8 md:mb-0">
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Users className="h-7 w-7" />
                            {title}
                        </h1>
                        <p className="mt-2 text-gray-600 max-w-xl">{description}</p>
                    </div>
                    <Button
                        className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                        onClick={handleShare}
                    >
                        <Share2 className="h-4 w-4" />
                        {copied ? shareText.copied : shareText.default}
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
