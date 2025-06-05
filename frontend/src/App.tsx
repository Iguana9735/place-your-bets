import {Button, ButtonGroup, Container, Grid, Stack, styled,} from "@mui/material";
import PriceDisplay from "./PriceDisplay.tsx";
import ScoreDisplay from "./ScoreDisplay.tsx";

function App() {

    const score = 40;
    const bitcoinPrice = 101453.80;

    return (
        <>
            <SiteContainer maxWidth={"md"}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Title> Is Bitcoin going up or down? Take a guess! </Title>
                    </Grid>
                    <Grid size={8}>
                        <GuessButtons/>
                    </Grid>
                    <Grid size={4}>
                        <Stack spacing={2}>
                            <ScoreDisplay score={score}/>
                            <PriceDisplay price={bitcoinPrice}/>
                        </Stack>
                    </Grid>
                </Grid>
            </SiteContainer>
        </>
    )
}

const GuessButtons = () => {
    return (
        <ButtonGroup orientation="vertical" aria-label="Vertical button group">
            <Button>Up</Button>,
            <Button>Down</Button>,
        </ButtonGroup>
    );
}

const SiteContainer = styled(Container)(({theme}) => ({
    marginTop: theme.spacing(5),
}))

const Title = styled('div')(({theme}) => ({
    ...theme.typography.h5,
    color: theme.palette.text.primary
}));

export default App
