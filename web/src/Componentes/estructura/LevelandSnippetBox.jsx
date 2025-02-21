import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Grid from '@mui/material/Grid2';
import { Typography, useTheme } from '@mui/material';
import CodeEditor from '../../CodeEditor';

export default function LevelandSnippetBox() {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    let levels = ["Level 2", "Level 3", "Level 4"]

    const theme = useTheme()

    const menuItemStyles = {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.secondary.main,
        fontSize: '20px',
        "&:hover": {
            backgroundColor: theme.palette.tertiary.main
        }
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid size={6}>
                    <Box
                        sx={{
                            height: 400,
                            borderRadius: 1,
                            bgcolor: 'secondary.main',
                            marginTop: '10px'
                        }}
                    >
                        <Button color="tertiary" variant='contained' style={{ fontSize: '20px', marginRight: '30px', marginLeft: '15px', marginTop: '15px' }}
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={handleClick}>
                            Level 1
                            <Icon style={{ alignContent: 'center', marginLeft: '10px', fontSize: '40px' }} >arrow_drop_down</Icon>
                        </Button>
                        <Menu color="tertiary" id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                            {levels.map((level) => (
                                <MenuItem sx={menuItemStyles} variant='contained' onClick={handleClose}>{level}</MenuItem>
                            ))}
                        </Menu><br />
                        <Box sx={{ padding: '30px' }}>
                            <Typography sx={{ color: 'primary.main', fontSize: '18px' }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur blanditiis amet minima deserunt quaerat, architecto itaque omnis placeat aut, harum quam libero. Odio dicta suscipit, illum maxime est vitae assumenda!</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={6}>
                    <Box sx={{ height: 400, borderRadius: 1, bgcolor: 'secondary.main',marginTop:'10px'}}>
                        <Typography sx={{fontSize: '26px',marginLeft:'10px'}}>Prueba tu código aquí.</Typography>
                        <CodeEditor></CodeEditor>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}