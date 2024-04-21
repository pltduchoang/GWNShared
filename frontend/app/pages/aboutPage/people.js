
export default function People() {
    // Photo and Description of the Team
    const peopleData = [
        {link: "/images/EZ-pic.webp", text:"Emily Z. - Co-founder & Certified Nutrition Coach. Mounatain Bike connoisseur."},
        {link: "/images/DS-pic.webp", text:"Deanna S. - Co-founder, Certified Precision Nutrition & life Consultant. Music aficionado."},
        {link: "/images/BN-pic.webp", text:"Bella-Nicole. Precision Nutrition Certified Coach specializing in plant based nutrition."},
    ];


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto text-black">
                <h1 className="text-4xl text-center font-bold mb-4">Meet the Team</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {peopleData.map((person, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <img src={person.link} alt={`Image ${index + 1}`} className="w-full mb-2" />
                            <p className="text-center">{person.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}