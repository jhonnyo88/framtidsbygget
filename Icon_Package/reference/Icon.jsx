import React from 'react';
import PropTypes from 'prop-types';
import styles from './Icon.module.css';

/**
 * Icon component for Framtidsbygget
 * Renders Material Symbols icons with consistent styling
 */
const Icon = ({
  name,
  size = 'medium',
  color = 'default',
  interactive = false,
  spinning = false,
  pulse = false,
  className = '',
  onClick,
  ariaLabel,
  ariaHidden,
  ...restProps
}) => {
  // Determine if icon should be interactive
  const isInteractive = interactive || !!onClick;
  const Component = isInteractive ? 'button' : 'span';
  
  // Build class names
  const iconClasses = [
    'material-symbols-outlined',
    styles.icon,
    styles[`icon--${size}`],
    styles[`icon--${color}`],
    isInteractive && styles['icon--interactive'],
    spinning && styles['icon--spinning'],
    pulse && styles['icon--pulse'],
    className
  ].filter(Boolean).join(' ');

  // Handle click events
  const handleClick = (e) => {
    if (onClick) {
      e.stopPropagation();
      onClick(e);
    }
  };

  // Determine ARIA attributes
  const ariaAttributes = {
    'aria-label': ariaLabel || (isInteractive ? name : undefined),
    'aria-hidden': ariaHidden || (!isInteractive && !ariaLabel ? 'true' : undefined),
    role: ariaLabel && !isInteractive ? 'img' : undefined
  };

  return (
    <Component
      className={iconClasses}
      onClick={isInteractive ? handleClick : undefined}
      type={Component === 'button' ? 'button' : undefined}
      {...ariaAttributes}
      {...restProps}
    >
      {name}
    </Component>
  );
};

Icon.propTypes = {
  /**
   * Material Symbols icon name
   */
  name: PropTypes.string.isRequired,
  
  /**
   * Icon size variant
   */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  
  /**
   * Semantic color variant
   */
  color: PropTypes.oneOf([
    'default',
    'primary', 
    'secondary',
    'success',
    'error',
    'warning',
    'info',
    'on-primary'
  ]),
  
  /**
   * Enable interactive states (hover, focus)
   */
  interactive: PropTypes.bool,
  
  /**
   * Apply spinning animation
   */
  spinning: PropTypes.bool,
  
  /**
   * Apply pulse animation
   */
  pulse: PropTypes.bool,
  
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
  
  /**
   * Click event handler
   */
  onClick: PropTypes.func,
  
  /**
   * Custom accessibility label
   */
  ariaLabel: PropTypes.string,
  
  /**
   * Hide from screen readers
   */
  ariaHidden: PropTypes.bool
};

export default Icon;