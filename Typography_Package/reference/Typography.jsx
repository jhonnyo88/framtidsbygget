import React from 'react';
import PropTypes from 'prop-types';
import styles from './Typography.module.css';

/**
 * Heading component for Framtidsbygget
 * Renders semantic headings with consistent styling
 */
export const Heading = ({
  level,
  variant = 'default',
  align = 'left',
  truncate = false,
  className = '',
  as,
  children,
  ...restProps
}) => {
  // Validate level
  if (!level || level < 1 || level > 5) {
    console.error('Heading: level prop must be between 1 and 5');
    return null;
  }

  // Determine element to render
  const Tag = as || `h${level}`;
  
  // Build class names
  const headingClasses = [
    styles.heading,
    styles[`heading--h${level}`],
    variant === 'display' && styles['heading--display'],
    styles[`heading--align-${align}`],
    truncate && styles['heading--truncate'],
    className
  ].filter(Boolean).join(' ');

  return (
    <Tag className={headingClasses} {...restProps}>
      {children}
    </Tag>
  );
};

Heading.propTypes = {
  /**
   * Heading level (1-5)
   */
  level: PropTypes.oneOf([1, 2, 3, 4, 5]).isRequired,
  
  /**
   * Visual variant
   */
  variant: PropTypes.oneOf(['default', 'display']),
  
  /**
   * Text alignment
   */
  align: PropTypes.oneOf(['left', 'center', 'right']),
  
  /**
   * Truncate text with ellipsis
   */
  truncate: PropTypes.bool,
  
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
  
  /**
   * Render as different element
   */
  as: PropTypes.elementType,
  
  /**
   * Heading content
   */
  children: PropTypes.node.isRequired
};

/**
 * Body component for paragraph text
 * Handles different sizes and semantic variants
 */
export const Body = ({
  size = 'medium',
  weight = 'regular',
  variant = 'default',
  align = 'left',
  truncate = false,
  className = '',
  as = 'p',
  children,
  ...restProps
}) => {
  const Tag = as;
  
  const bodyClasses = [
    styles.body,
    styles[`body--${size}`],
    styles[`body--${weight}`],
    styles[`body--${variant}`],
    styles[`body--align-${align}`],
    truncate && styles['body--truncate'],
    className
  ].filter(Boolean).join(' ');

  return (
    <Tag className={bodyClasses} {...restProps}>
      {children}
    </Tag>
  );
};

Body.propTypes = {
  /**
   * Text size
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  
  /**
   * Font weight
   */
  weight: PropTypes.oneOf(['regular', 'medium', 'semibold']),
  
  /**
   * Semantic variant for color
   */
  variant: PropTypes.oneOf(['default', 'secondary', 'error', 'success', 'warning']),
  
  /**
   * Text alignment
   */
  align: PropTypes.oneOf(['left', 'center', 'right']),
  
  /**
   * Truncate text with ellipsis
   */
  truncate: PropTypes.bool,
  
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
  
  /**
   * Element type to render
   */
  as: PropTypes.elementType,
  
  /**
   * Text content
   */
  children: PropTypes.node.isRequired
};

/**
 * Caption component for small text
 * Used for metadata, labels, and supporting text
 */
export const Caption = ({
  variant = 'default',
  uppercase = false,
  className = '',
  children,
  ...restProps
}) => {
  const captionClasses = [
    styles.caption,
    styles[`caption--${variant}`],
    uppercase && styles['caption--uppercase'],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={captionClasses} {...restProps}>
      {children}
    </span>
  );
};

Caption.propTypes = {
  /**
   * Semantic variant for color
   */
  variant: PropTypes.oneOf(['default', 'secondary', 'error', 'success', 'warning']),
  
  /**
   * Transform text to uppercase
   */
  uppercase: PropTypes.bool,
  
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
  
  /**
   * Caption content
   */
  children: PropTypes.node.isRequired
};