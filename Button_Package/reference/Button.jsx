import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

/**
 * Button component for Framtidsbygget
 * Supports multiple variants, sizes, and icon integration
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...restProps
}) => {
  // Build dynamic class names
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    fullWidth && styles['button--full-width'],
    disabled && styles['button--disabled'],
    !children && icon && styles['button--icon-only'],
    className
  ].filter(Boolean).join(' ');

  // Check if this is an icon-only button
  const isIconOnly = !children && icon;

  // Render icon element
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconClasses = [
      'material-symbols-outlined',
      styles.button__icon,
      children && iconPosition === 'left' && styles['button__icon--left'],
      children && iconPosition === 'right' && styles['button__icon--right']
    ].filter(Boolean).join(' ');

    return (
      <span className={iconClasses} aria-hidden="true">
        {icon}
      </span>
    );
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      aria-label={isIconOnly ? `${icon} button` : undefined}
      {...restProps}
    >
      {iconPosition === 'left' && renderIcon()}
      {children && <span className={styles.button__text}>{children}</span>}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};

Button.propTypes = {
  /**
   * Button content - text and/or elements
   */
  children: PropTypes.node,
  
  /**
   * Visual style variant
   */
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  
  /**
   * Size variant
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  
  /**
   * Disabled state
   */
  disabled: PropTypes.bool,
  
  /**
   * Make button full width of container
   */
  fullWidth: PropTypes.bool,
  
  /**
   * Material Symbol icon name
   */
  icon: PropTypes.string,
  
  /**
   * Icon position relative to text
   */
  iconPosition: PropTypes.oneOf(['left', 'right']),
  
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
  
  /**
   * HTML button type attribute
   */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  
  /**
   * Click event handler
   */
  onClick: PropTypes.func
};

export default Button;