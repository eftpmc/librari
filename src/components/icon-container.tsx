import * as React from "react";
import styles from '@/styles/icon-container.module.css';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

interface IconButtonProps {
  iconSrc: string;
  altText: string;
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ iconSrc, altText, onClick }) => (
  <div className={styles.iconButton} onClick={onClick}>
    <img src={iconSrc} alt={altText} />
  </div>
);

const IconButtonContainer: React.FC = () => {
  return (
    <div className={styles.iconButtonContainer}>
      <IconButton iconSrc="books.png" altText="Apple Books" onClick={() => console.log("Books clicked!")} />
      <IconButton iconSrc="pdf.png" altText="PDF" onClick={() => console.log("PDF clicked!")} />
      <IconButton iconSrc="mobi.png" altText="Mobi" onClick={() => console.log("Mobi clicked!")} />
      {/* Add more icon buttons as needed */}
    </div>
  );
}

export { IconButtonContainer, IconButton };
