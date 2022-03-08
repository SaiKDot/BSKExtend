import React, { useEffect } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'


const MtButton = React.forwardRef((props, ref) => {

    console.log('MtButton')

    const { type,
        disabled,
        style,
        onClick,
        onFocus,
        onKeyDown,
        onKeyUp,
        onMouseDown } = props

    // useEffect(() => {
    //     console.log(style);

    // }, [])
    return (

        <Sbutton
            {...props}
        >
            {props.children}
            {props.text}

        </Sbutton>


    )
})

const Sbutton = styled.button`
    --white:#FFF;
    --color-white-2:rgba(255,255,255,0.87);
     --green1:#00a65a;
    --green2: #4CAF50;
    --green3: #008d4c;
    --green4: #255625;
    --dark1: #404040;
    --dark2: #4d4d4d;
    --dark3: #424242;
    --dark4: #505050;
    --dark5: #282c34;
    --danger1:#dd4b39;
    --danger2:#d73925;
    --danger3:#c9302c;
    --danger4: #ac2925; 
    outline:none;
    display: block;
    font-family: Arial;
    width: ${props => props.style.width || '140px'};
    height: ${props => props.style.height || '35px'};
    text-transform: uppercase;
    letter-spacing: 2.5px;
    font-weight: 500;
    color: #fff;
    background-image: none;
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 26%);
    transition: all 0.2s ease 0s;
    cursor: pointer;
    border-width: 1px;
    user-select: none;    
    opacity: 1;
    margin: 15px;
    overflow: visible;
    white-space: nowrap;
    border-radius: 0px; 
    position: relative;   
    border: 1px solid ${props => props.success ? 'var(--green3)' : props.dark ? 'var(--dark2)' : props.danger ? 'var(--danger2)' : ''};
    background-color: ${props => props.success ? 'var(--green1)' : props.dark ? 'var(--dark3)' : props.danger ? 'var(--danger1)' : ''};    
    ${props => props.disabled == true && css`
        cursor: not-allowed;
        filter: alpha(opacity=65);
        opacity: .65; 
        box-shadow: none;
    `}
  
    &::after {
        content: "";        
        position: absolute;
        top: 0;
        left: 0;
        bottom:0;
        top:0;
        width: calc(100% + 1px);
        height: calc(100% + 1px);
        box-shadow: 0 14px 28px rgb(0 0 0 / 25%), 0 10px 10px rgb(0 0 0 / 22%);
        opacity:0;
        transition: opacity .6s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
      &::before {
        content: "";        
        position: absolute;
        top: 0;
        left: 0;
        bottom:0;
        top:0;
        width: calc(100% + 1px);
        height: calc(100% + 1px);
        box-shadow: inset 0 3px 5px rgb(0 0 0 / 51%);
        ${props => props.disabled && css`       
            box-shadow: none;
        `}
        opacity:0;
        transition: opacity .6s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    &:hover:after{
        opacity:1;
    }
    &:active:after{
         opacity:0;
    }
    &:hover:before{
        opacity:0;
    }
    &:active:before{
         opacity:1;
    }
    &:active {
        letter-spacing: 2.0px;        
        ${props => props.disabled && css`            
            letter-spacing: 2.5px;
            box-shadow: none;
        `}
    }
    &:hover, &:active {        
        background-color: ${props => props.success ? 'var(--green3)' : props.dark ? 'var(--dark2)' : props.danger ? 'var(--danger3)' : ''};          ;
        
    };
    &:active:focus, &:active:hover {
        background-color:  ${props => props.success ? 'var(--green2)' : props.dark ? 'var(--dark4)' : props.danger ? 'var(--danger3)' : ''};  
        border-color: ${props => props.success ? 'var(--green4)' : props.dark ? 'var(--dark3)' : props.danger ? 'var(--danger4)' : ''}; 
    }   
    
    
`
MtButton.displayName = 'MtButton'

MtButton.defaultProps = {
    style: {},
    type: 'button',
    disabled: false,

}
MtButton.propType = {
    type: PropTypes.string,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    text: PropTypes.string,
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onMouseDown: PropTypes.func,
}


export default MtButton;