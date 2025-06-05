import ValueDisplay from "./ValueDisplay.tsx";

type Props = {
    price: number
}

function PriceDisplay({price}: Props) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <ValueDisplay title={"Current BTC price"} value={formatter.format(price)}/>
    )
}

export default PriceDisplay
