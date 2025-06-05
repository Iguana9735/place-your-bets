import {Container, Grid, styled,} from "@mui/material";
import PriceDisplay from "./PriceDisplay.tsx";

function App() {

    const SiteContainer = styled(Container)(({theme}) => ({
        marginTop: theme.spacing(5)
    }))

    return (
        <>
            <SiteContainer maxWidth={"md"}>
                <Grid container spacing={8}>
                    <Grid size={8}>
                    </Grid>
                    <Grid size={4}>
                        <PriceDisplay price={101453.80}/>
                    </Grid>
                </Grid>
            </SiteContainer>
        </>
    )
}

export default App
