
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

interface SecureMessageBubbleProps {
  content: string | React.ReactNode;
  timestamp: string;
  isOwn: boolean;
  isEncrypted?: boolean;
  onDecrypt?: () => void;
  children?: React.ReactNode;
}

const SecureMessageBubble: React.FC<SecureMessageBubbleProps> = ({
  content,
  timestamp,
  isOwn,
  isEncrypted = false,
  onDecrypt,
  children
}) => {
  const bubbleClass = isOwn
    ? "bg-primary text-primary-foreground self-end"
    : "bg-muted text-foreground self-start";
  
  return (
    <div className={`max-w-[80%] rounded-lg p-3 ${bubbleClass}`}>
      {isEncrypted ? (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} />
            <span className="text-xs font-medium">Message sécurisé</span>
          </div>
          <div className="text-sm mb-2">
            {typeof content === 'string' ? '••••••••••••••••••••' : content}
          </div>
          <Button size="sm" variant="secondary" onClick={onDecrypt}>
            Déchiffrer
          </Button>
        </div>
      ) : (
        <>
          <div className="text-sm">{content}</div>
          {children}
        </>
      )}
      <div className="text-xs opacity-70 mt-1 text-right">
        {timestamp}
      </div>
    </div>
  );
};

export default SecureMessageBubble;
