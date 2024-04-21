"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import DefaultPhoto from "../../public/images/default-profile.png";


export default function ProfilePhoto() {
    return (
        // <div className="flex justify-center">
        //     <img src={DefaultPhoto} alt="Profile Photo" className="rounded-full h-32 w-32" />
        // </div>
        <div>
            <Image 
                src={DefaultPhoto} 
                alt="Profile Photo" 
                width={200} 
                height={200}
                className="rounded-full"
            />
        </div>
    )
}