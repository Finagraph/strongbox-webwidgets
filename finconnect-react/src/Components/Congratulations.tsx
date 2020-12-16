﻿import * as React from 'react'
import '../styles.scss'

import CheckIcon from '@material-ui/icons/CheckCircleRounded';

import { BuildThemeStyle, Theme } from '../Models/Theme/Theme';
import { defaultControlStyleMap } from '../Models/Theme/ThemeControls';
import { defaultControlPaletteStyleMap } from '../Models/Theme/ThemePalette';

export type CongratulationsProps = {
    theme?: Theme;
    onDone: () => void;
    children?: JSX.Element;
}

const Congratulations: React.FC<CongratulationsProps> = (props: CongratulationsProps): React.ReactElement => {
    let buttonStyle = BuildThemeStyle(
        { marginTop: '20px' },
        defaultControlPaletteStyleMap,
        props.theme
    );
    buttonStyle = BuildThemeStyle(buttonStyle, defaultControlStyleMap, props.theme);

    return (
        <>
            <CheckIcon style={{
                marginTop: '40px',
                width: '48px',
                height: '48px'
            }} />
            {!(props.children) && (
                <p>Your financial data has been submitted!</p>
            )}
            <button style={buttonStyle} onClick={props.onDone}>
                Done
            </button>
        </>
    );
}

export default Congratulations;
