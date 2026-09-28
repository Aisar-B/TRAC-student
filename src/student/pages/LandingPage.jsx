import React, { useEffect, useState } from "react";
import { ArrowRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OFFICE, SCHOOL, SYSTEM } from "../../config/trac.config";

export default function LandingPage() {
  const navigate = useNavigate();
  const [contactEmail, setContactEmail] = useState(SCHOOL.contact.email);

  useEffect(() => {
    const fetchPublicSettings = async () => {
      try {
        const response = await fetch(`${SYSTEM.apiBaseUrl}/public/settings`);
        if (response.ok) {
          const data = await response.json();
          if (data.contact_email) setContactEmail(data.contact_email);
        }
      } catch {
        console.warn('Using default contact email');
      }
    };
    fetchPublicSettings();
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-white via-[#F9FBE7] to-[#F1F8E9] text-[#173b20]">
      <section className="relative isolate flex min-h-[min(760px,100vh)] items-center justify-center overflow-hidden bg-[#071b12] px-5 py-12 text-white sm:px-8 sm:py-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Tracbg.png')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(4,24,15,0.86)_0%,rgba(4,24,15,0.62)_52%,rgba(3,15,10,0.78)_100%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(2,15,9,0.5)_100%)]" aria-hidden="true" />
        <div className="relative z-10 mx-auto w-full max-w-xl text-center">
          <main>
            <div className="mb-7 flex justify-center">
              <div className="rounded-full bg-white p-2 shadow-lg shadow-black/25">
              <img
                src={SCHOOL.logo}
                alt={`${SCHOOL.shortName} Logo`}
                className="h-32 w-32 rounded-full bg-white object-contain sm:h-40 sm:w-40"
                onError={(e) => { e.target.src = SCHOOL.logoFallback; }}
              />
              </div>
            </div>

            <p className="mb-3 font-serif text-2xl font-bold uppercase tracking-[0.12em] text-[#ffe08a] sm:text-3xl">
              Welcome to
            </p>
            <h1 className="text-4xl font-black leading-none tracking-tight sm:text-5xl">
              <span className="text-white">TRAC</span>{" "}
              <span className="text-[#F9A825]">REQUEST</span>
            </h1>

            <p className="mt-4 text-base font-semibold leading-relaxed text-white/85 sm:text-lg">
              {SCHOOL.subtitle}
            </p>


            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate("/login")}
                className="trac-button inline-flex min-w-52 items-center justify-center gap-2 rounded-xl px-8 py-3.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/40"
              >
                Get Started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </main>
        </div>
      </section>

      <section className="border-t border-[#DCE8D2] bg-[#F1F8E9]" aria-labelledby="contact-heading">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-16">
          <div className="mb-9 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F57F17]">Registrar support</p>
            <h2 id="contact-heading" className="mt-2 text-2xl font-bold text-[#173b20] sm:text-3xl">
              Need assistance with your request?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              Reach the Registrar&apos;s Office during office hours or browse the FAQ for quick answers about accounts, documents, and processing.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <a href={`mailto:${contactEmail}`} className="group border-t border-[#B8CBAF] pt-4 transition hover:border-[#F9A825]">
              <Mail className="h-5 w-5 text-[#F9A825]" aria-hidden="true" />
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-500">Email</p>
              <p className="mt-1 break-words text-sm font-semibold text-[#173b20] group-hover:text-[#33691E]">{contactEmail}</p>
            </a>

            <a href={`tel:${SCHOOL.contact.phone}`} className="group border-t border-[#B8CBAF] pt-4 transition hover:border-[#F9A825]">
              <Phone className="h-5 w-5 text-[#F9A825]" aria-hidden="true" />
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-500">Phone</p>
              <p className="mt-1 text-sm font-semibold text-[#173b20] group-hover:text-[#33691E]">{SCHOOL.contact.phone}</p>
            </a>

            <div className="border-t border-[#B8CBAF] pt-4">
              <MapPin className="h-5 w-5 text-[#F9A825]" aria-hidden="true" />
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-500">Office address</p>
              <p className="mt-1 text-sm font-semibold leading-relaxed text-[#173b20]">{SCHOOL.contact.officeLocation}</p>
            </div>

            <div className="border-t border-[#B8CBAF] pt-4">
              <Clock3 className="h-5 w-5 text-[#F9A825]" aria-hidden="true" />
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-500">Office hours</p>
              <p className="mt-1 text-sm font-semibold leading-relaxed text-[#173b20]">{OFFICE.schedule.days}</p>
              <p className="text-sm leading-relaxed text-gray-600">{OFFICE.schedule.morning}</p>
              <p className="text-sm leading-relaxed text-gray-600">{OFFICE.schedule.afternoon}</p>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-4 border-t border-[#DCE8D2] pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {SCHOOL.footer.copyright}</p>
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Footer links">
              <button onClick={() => navigate("/need-help")} className="font-semibold text-[#33691E] transition hover:text-[#F57F17]">
                Need Help?
              </button>
              <button onClick={() => navigate("/privacy")} className="font-semibold text-[#33691E] transition hover:text-[#F57F17]">
                Privacy Notice
              </button>
              <button onClick={() => navigate("/faq")} className="inline-flex items-center gap-2 font-semibold text-[#F57F17] transition hover:text-[#33691E]">
                Visit the FAQ
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
