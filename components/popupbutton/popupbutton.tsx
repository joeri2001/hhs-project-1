"use client";

import { useState } from "react";
import MicrobitReader from "../microbit/microbitreader";

export default function PopUpButton() {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <div className={`${isOpen ? "visible" : "invisible pointer-events-none"}`}>
                <div className={"w-screen h-screen fixed bg-red-400 top-0 left-0"}>
                    <button onClick={() => setIsOpen(false)}>A</button>
                    <MicrobitReader />
                </div>
            </div>
            <div>
                <button onClick={() => setIsOpen(true)}>test</button>
            </div>
        </>
    );
}