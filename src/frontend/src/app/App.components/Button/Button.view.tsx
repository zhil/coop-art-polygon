import * as PropTypes from 'prop-types'
import * as React from 'react'

import { BUTTON, ButtonColors, ButtonTypes, PRIMARY } from './Button.constants'
import { ButtonIcon, ButtonLoadingIcon, ButtonStyled, ButtonText } from './Button.style'

type ButtonViewProps = {
  text: string
  icon?: string
  color?: ButtonColors
  onClick?: () => void
  clickCallback: () => void
  clicked: boolean
  type?: ButtonTypes
  loading: boolean
  disabled?: boolean
}

export const ButtonView = ({
  text,
  icon,
  color,
  onClick,
  clickCallback,
  clicked,
  type,
  loading,
  disabled,
}: ButtonViewProps) => {
  let buttonClasses = color
  if (clicked) buttonClasses += ' clicked'
  if (loading) buttonClasses += ' loading'
  return (
    <ButtonStyled
      disabled={disabled}
      className={buttonClasses}
      onClick={() => {
        clickCallback()
        onClick && onClick()
      }}
      type={type}
    >
      <ButtonText>
        {loading ? (
          <>
            <ButtonLoadingIcon>
              <use xlinkHref="/icons/sprites.svg#loading" />
            </ButtonLoadingIcon>
            Waiting for confirmation
          </>
        ) : (
          <>
            {icon && (
              <ButtonIcon className={color}>
                <use xlinkHref={`/icons/sprites.svg#${icon}`} />
              </ButtonIcon>
            )}
            {text}
          </>
        )}
      </ButtonText>
    </ButtonStyled>
  )
}

ButtonView.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  clickCallback: PropTypes.func.isRequired,
  clicked: PropTypes.bool.isRequired,
  type: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
}

ButtonView.defaultProps = {
  icon: undefined,
  color: PRIMARY,
  type: BUTTON,
  loading: false,
  disabled: false,
}
