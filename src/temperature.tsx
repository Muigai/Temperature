import { TextBox, textVal } from "rahisi";
import { React } from "rahisi";
import * as S from "rahisi";

import {
    A2, F0,
} from "rahisi-type-utils";

type Scale = "c" | "f";

const scaleNames = {
    c: "Celsius",
    f: "Fahrenheit",
};

class Temperature {

    private readonly celsius: number;

    constructor(private readonly units: number, private readonly scale: Scale) {
        if (scale === "c") {
            this.celsius = units;
        } else {
            this.celsius = (units - 32) * 5 / 9;
        }
    }

    public getCelsius = () => this.celsius;

    public getFahrenheit = () => (this.celsius * 9 / 5) + 32;
}

const boilingVerdict =
    (temperature: F0<Temperature| null>) => (
        <p>
            {
                () => !temperature() ? "" : `The water would ${temperature()!.getCelsius() > 100 ? "" : "not"} boil`
            }
        </p>);

const temperatureInput = (
    temperature: F0<Temperature| null>,
    setTemperature: A2<string, Scale>,
    scale: "c" | "f") => {

    const getValue =
        () => !temperature() ? "" :
            scale === "c" ? temperature()!.getCelsius().toString() :
                temperature()!.getFahrenheit().toString();

    return (
        <fieldset>
            <legend>Enter temperature in {scaleNames[scale]}:</legend>
            <TextBox value={getValue} onKeyUp={(s) => setTemperature(textVal(s), scale)} />
        </fieldset>
    );

};

function main() {

    let temperature: Temperature | null = null;

    const getTemperature = () => temperature;

    const setTemperature =
        (t: string, scale: Scale) => {
            const units = parseFloat(t);

            isNaN(units) ? temperature = null : temperature = new Temperature(units, scale);
        };

    const calculator = () => (
        <div>
            {temperatureInput(getTemperature, setTemperature, "c")}
            {temperatureInput(getTemperature, setTemperature, "f")}
            {boilingVerdict(getTemperature)}
        </div>
    ).mount(document.body);

    calculator();
}

document.addEventListener("DOMContentLoaded", main, false);
