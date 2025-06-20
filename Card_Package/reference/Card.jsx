import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.module.css';
import { CardHeader, CardContent, CardFooter } from './CardSubcomponents';

/**
 * Card component for Framtidsbygget
 * Flexible container with header, content, and footer sections
 */
const Card = ({
  children,
  variant = 'flat',
  interactive = false,
  disabled = false,
  className = '',
  onClick,
  as: Component = 'div',
  ...restProps
}) => {
  // Build dynamic class names
  const cardClasses = [
    styles.card,
    styles[`card--${variant}`],
    interactive && styles['card--interactive'],
    disabled && styles['card--disabled'],
    onClick && !disabled && styles['card--clickable'],
    className
  ].filter(Boolean).join(' ');

  // Handle click events
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  // Handle keyboard events for clickable cards
  const handleKeyDown = (e) => {
    if (!disabled && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <Component
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick && !disabled ? 0 : undefined}
      role={onClick && !disabled ? 'button' : undefined}
      aria-disabled={disabled || undefined}
      {...restProps}
    >
      {children}
    </Component>
  );
};

Card.propTypes = {
  /**
   * Card content - typically Card.Header, Card.Content, and/or Card.Footer
   */
  children: PropTypes.node.isRequired,
  
  /**
   * Visual style variant
   */
  variant: PropTypes.oneOf(['flat', 'elevated', 'outlined']),
  
  /**
   * Enable interactive hover states (even without onClick)
   */
  interactive: PropTypes.bool,
  
  /**
   * Disabled state
   */
  disabled: PropTypes.bool,
  
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
  
  /**
   * Click event handler - makes the card clickable
   */
  onClick: PropTypes.func,
  
  /**
   * Render card as a different element type
   */
  as: PropTypes.elementType
};

// Attach subcomponents
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;