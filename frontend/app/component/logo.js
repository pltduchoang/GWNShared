import Image from 'next/image';
import Link from 'next/link';
// import LogoImage from '../media/images/gwn-logo.png';
import LogoImage from '../media/images/GWM-LOGO-small.png';


export default function Logo() {
    return (

        <Link href="../pages/mainPage">
            <Image 
                src={LogoImage} 
                alt="GWN Logo" 
                width={350} 
                height={350}
            /> 
        </Link>
    );
}