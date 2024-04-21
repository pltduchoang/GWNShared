
export default function People() {
    // Photo and Description of the Team
    const peopleData = [
        {link: "/images/PreparingFruitJuice.webp", text:"Get ready to follow through on your customized program & recommendations from our coaches that care about your success."},
        {link: "/images/SportsFacility.webp", text:"Let us get to know you and your goals. Upon enrolment you will receive a health sheet & intake form to help us learn about you so we can customize the right plan for your specific goals."},
        {link: "/images/HighFive.webp", text:"Meet your coach. Get the benefit of working 1:1 with our  coaching experts to ensure your success. Set up your weekly appointments, discuss your goals and get started on your journey! "},
        {link: "/images/Groceries.webp", text:"Receive your personalized plan. Our coaches will put together your customized plan tailored to your information for optimal results. Expect this within 1 business day. "},
    ];


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {peopleData.map((person, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <img src={person.link} alt={`Image ${index + 1}`} className="w-full mb-2" />
                            <p className="text-left text-black" >{person.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}