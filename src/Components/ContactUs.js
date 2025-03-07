import logoImage from '../assets/logo.webp';

const ContactUs = () => {
    return (
        <div className="absolute p-8 bg-primaryBg h-full w-full">
            <a href="/" className="inline-block py-4 w-fit" title="Home">
                <img
                    alt="Home"
                    src={logoImage}
                    className="h-8 sm:h-10 md:h-10"
                />
            </a>
            <h2 className="text-3xl text-white font-bold font-serif ">ContactUs:</h2>
            <p className="text-xl text-white font-serif mb-4">moviegalaxy@example.com</p>

        </div>
    );
};

export default ContactUs; 