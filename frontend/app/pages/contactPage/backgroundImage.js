

export default function BackgroundImage() {
    // Photo for the about us Banner page
    return (
        <div className=" h-[600px] relative overflow-hidden">
            <img 
                src="/images/Contactus.jpg" 
                className="w-full min-h-[600px] min-w-[700px]" 
                alt="Background" 
            />
            {/*Dark Filter for the banner photo*/}
            <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
    );
}