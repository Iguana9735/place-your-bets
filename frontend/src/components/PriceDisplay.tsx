import ValueDisplay from "./ValueDisplay.tsx";
import {formatMoney} from "../utils/formatters.ts";

type Props = {
    price: number
}

function PriceDisplay({price}: Props) {
    return (
        <ValueDisplay title={"Current BTC price"} value={formatMoney(price)}/>
    )
}

export default PriceDisplay
