import { createMuiTheme, Theme } from '@material-ui/core/styles';
import {
    strongboxPrimary,
    strongboxSecondary,
} from './Constants';

export function CreateStdTheme(): Theme {
    let primaryColor = strongboxPrimary;
    let secondaryColor = strongboxSecondary;

    return(createMuiTheme({
        palette: {
            primary: {
                main: primaryColor,
            },
            secondary: {
                main: secondaryColor,
            }
        }
    }));
}
