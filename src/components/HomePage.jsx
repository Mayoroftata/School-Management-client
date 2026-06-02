import Image from "next/image";
import Link from "next/link";
import { Icon } from "./Icon";

const landingImages = [
    {
        src: "/images/pexels-kayode-balogun-169877002-12091126.jpg",
        alt: "Students gathered on a Nigerian school campus"
    },
    {
        src: "/images/pexels-yankrukov-8617765.jpg",
        alt: "Teacher supporting students in class"
    },
    {
        src: "/images/pexels-ron-lach-10638069.jpg",
        alt: "Student reading in a school learning space"
    }
];

export default function Home() {
    return (
        <main className="min-h-screen bg-paper text-ink" suppressHydrationWarning>
            <header className="absolute left-0 right-0 top-0 z-20">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-white">
                    <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-lg bg-linear-to-br from-gold to-[#f0c66a] text-[#10241e]">
                            <Icon name="shield" />
                        </div>
                        <div>
                            <strong className="block leading-tight">Greenfield College</strong>
                            <span className="text-sm text-white/75">Secondary School, Nigeria</span>
                        </div>
                    </div>
                    <div className="hidden items-center gap-5 text-sm font-semibold md:flex">
                        <a href="#about">About</a>
                        <a href="#admissions">Admissions</a>
                        <a href="#contact">Contact</a>
                        <Link className="rounded-lg bg-white px-4 py-2 text-emerald-dark" href="/student/login">Student Login</Link>
                    </div>
                </nav>
            </header>

            <section className="relative grid min-h-screen items-end overflow-hidden px-6 pb-12 pt-28 text-white">
                <div className="absolute inset-0">
                    {landingImages.map((image, index) => (
                        <Image
                            alt={image.alt}
                            className={`absolute inset-0 h-full w-full object-cover landing-slide landing-slide-${index + 1}`}
                            fill
                            key={image.src}
                            priority={index === 0}
                            sizes="100vw"
                            src={image.src}
                            unoptimized
                        />
                    ))}
                    <div className="absolute inset-0 bg-linear-to-t from-[#10241e] via-[#10241e]/55 to-[#10241e]/10" />
                </div>

                <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8">
                    <div className="max-w-4xl">
                        <h1 className="text-[clamp(2.8rem,7vw,6.8rem)] leading-[0.94] text-white">Raising confident scholars for Nigeria and beyond</h1>
                        <p className="mt-6 max-w-2xl text-lg leading-[1.7] text-white/82">
                            Greenfield College is a focused secondary school for JS1 to SS3 learners, combining disciplined academics, practical leadership and strong guidance through every term.
                        </p>
                    </div>

                    <div id="admissions" className="grid gap-4 rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur md:grid-cols-[1fr_auto_auto] md:items-center">
                        <div>
                            <h2 className="text-xl font-bold text-white">Want your child or ward to study at this reputable institution?</h2>
                            <p className="mt-2 text-sm leading-[1.6] text-white/75">Start a student admission file or continue with an existing student account.</p>
                        </div>
                        <Link className="primary bg-gold text-[#10241e]" href="/student/register">Register here</Link>
                        <Link className="secondary bg-white text-emerald-dark" href="/student/login">Log in here</Link>
                    </div>
                </div>
            </section>

            <section id="about" className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div>
                    <h2 className="text-4xl font-black leading-tight">A complete six-year Nigerian secondary pathway</h2>
                    <p className="mt-5 leading-[1.8] text-muted">
                        Students move through JS1, JS2 and JS3 before choosing Science, Commercial or Art in senior secondary school. English Language and Mathematics remain common foundations, while each department builds mastery in its specialist subjects.
                    </p>
                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                        {["JS1 - JS3", "SS1 - SS3", "Three terms yearly"].map((item) => (
                            <div className="rounded-lg border border-line bg-surface p-4 shadow-school" key={item}>
                                <strong>{item}</strong>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    {[
                        ["/images/pexels-droosmo-2982449.jpg", "Modern classroom learning"],
                        ["/images/pexels-elementsinteractive-33992840.jpg", "Focused student development"],
                        ["/images/pexels-ron-lach-10643463.jpg", "Structured academic guidance"],
                        ["/images/pexels-xhemphoto-15149189.jpg", "School community moments"]
                    ].map(([src, alt], index) => (
                        <div className={`relative overflow-hidden rounded-lg ${index % 2 ? "mt-8 h-64" : "h-72"}`} key={src}>
                            <Image alt={alt} className="object-cover" fill sizes="(max-width: 768px) 100vw, 25vw" src={src} unoptimized />
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-[#10241e] px-6 py-20 text-white">
                <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
                    {[
                        ["Academic reports", "Termly scoring, teacher remarks and end-of-term report-card access for students."],
                        ["Student welfare", "Anonymous complaint logging and guidance follow-up for sensitive issues."],
                        ["Fee records", "Payment history with successful, pending and failed transaction status."]
                    ].map(([title, body]) => (
                        <article className="rounded-lg border border-white/10 bg-white/8 p-6" key={title}>
                            <h3 className="text-xl font-bold">{title}</h3>
                            <p className="mt-3 text-sm leading-[1.7] text-white/70">{body}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section id="contact" className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:grid-cols-[1fr_0.8fr]">
                <div>
                    <h2 className="text-4xl font-black leading-tight">Contact the school</h2>
                    <p className="mt-4 max-w-2xl leading-[1.8] text-muted">
                        For admissions, transfer requests, fee enquiries or parent visits, contact the administrative office during school hours.
                    </p>
                </div>
                <div className="rounded-lg border border-line bg-surface p-6 shadow-school">
                    <p className="font-bold">Greenfield College Administrative Office</p>
                    <p className="mt-3 text-muted">12 Education Avenue, Lagos, Nigeria</p>
                    <p className="mt-3 text-muted">admissions@greenfield.edu.ng</p>
                    <p className="mt-3 text-muted">+234 803 000 0000</p>
                </div>
            </section>
        </main>
    );
}
