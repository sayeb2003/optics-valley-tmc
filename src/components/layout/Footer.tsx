import Link from "next/link";
import { club } from "@/config/club";

export function Footer() {
  return (
    <footer className="bg-navy-deep text-cream/70 px-6 py-12">
      <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-xl text-cream mb-2">{club.name}</p>
          <p className="text-sm">{club.tagline}</p>
          <p className="font-mono text-xs mt-4 text-cream/50">
            Club #{club.clubNumber} · District {club.district}, Area {club.area}
          </p>
        </div>

        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-gold-soft mb-3">
            Meetings
          </p>
          <p className="text-sm">{club.meeting.frequency}</p>
          <p className="text-sm">{club.meeting.time}</p>
          <p className="text-sm mt-2">{club.meeting.locationEn}</p>
          <p className="text-sm text-cream/50">{club.meeting.locationDirections}</p>
        </div>

        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-gold-soft mb-3">
            Get in Touch
          </p>
          <a href={`mailto:${club.contact.email}`} className="text-sm hover:text-gold transition-colors block">
            {club.contact.email}
          </a>
          <p className="text-sm mt-2">WeChat: {club.contact.wechatGroup}</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl mt-10 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between gap-2 text-xs text-cream/40">
        <p>© {new Date().getFullYear()} {club.name}. Chartered {club.charterDate}.</p>
        <Link href="/" className="hover:text-gold transition-colors">
          Optics Valley, Wuhan
        </Link>
      </div>
    </footer>
  );
}
