import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.module.css';

/**
 * Card Header Component
 * Used for card titles, subtitles, and header actions
 */
export const CardHeader = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  const headerClasses = [
    styles.card__header, 
    className
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClasses} {...props}>
      {children}
    </header>
  );
};

CardHeader.propTypes = {
  /**
   * Header content - typically title and optional actions
   */
  children: PropTypes.node.isRequired,
  
  /**
   * Additional CSS classes
   */
  className: PropTypes.string
};

/**
 * Card Content Component
 * Main content area of the card
 */
export const CardContent = ({ 
  children, 
  className = '',
  scrollable = false,
  ...props 
}) => {
  const contentClasses = [
    styles.card__content,
    scrollable && styles['card__content--scrollable'],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={contentClasses} {...props}>
      {children}
    </div>
  );
};

CardContent.propTypes = {
  /**
   * Main card content
   */
  children: PropTypes.node.isRequired,
  
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
  
  /**
   * Enable scrollable content with max-height
   */
  scrollable: PropTypes.bool
};

/**
 * Card Footer Component
 * Used for card actions and metadata
 */
export const CardFooter = ({ 
  children, 
  className = '', 
  align = 'right',
  ...props 
}) => {
  const footerClasses = [
    styles.card__footer,
    styles[`card__footer--${align}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <footer className={footerClasses} {...props}>
      {children}
    </footer>
  );
};

CardFooter.propTypes = {
  /**
   * Footer content - typically buttons or metadata
   */
  children: PropTypes.node.isRequired,
  
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
  
  /**
   * Content alignment within footer
   */
  align: PropTypes.oneOf(['left', 'center', 'right', 'space-between'])
};