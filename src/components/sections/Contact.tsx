import { useState } from 'react'
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Send,
  Copy,
  Check,
  MapPin,
} from 'lucide-react'
import axios from 'axios'
import SectionHeading from '../ui/SectionHeading'
import Container from '../ui/Container'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import { useProjects } from '../../hooks/useProjects'
import { useToast } from '../ui/Toast'

export default function Contact() {
  const { profile, content } = useProjects()
  const { showToast } = useToast()

  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = (e: React.MouseEvent, text: string, label: string) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopiedKey(label)
    showToast(`Copied ${label} to clipboard!`, 'success')
    setTimeout(() => setCopiedKey(null), 2500)
  }

  const contactMethods = [
    {
      icon: Mail,
      label: content.contactEmailInfoLabel || 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
      display: profile.email,
      subtext: 'Direct inbox',
    },
    {
      icon: Phone,
      label: content.contactPhoneLabel || 'Phone / WhatsApp',
      value: profile.phone,
      href: `tel:${profile.phone}`,
      display: profile.phone,
      subtext: 'Call or Telegram',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: profile.location,
      href: '#',
      display: profile.location || 'Ethiopia',
      subtext: 'East Africa Time (GMT+3)',
    },
  ]

  const socialLinks = [
    {
      icon: Github,
      href: profile.social.github,
      label: 'GitHub',
      color: 'hover:text-white hover:border-white/40 hover:bg-white/5',
    },
    {
      icon: Linkedin,
      href: profile.social.linkedin,
      label: 'LinkedIn',
      color: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10',
    },
    {
      icon: Send,
      href: profile.social.telegram,
      label: 'Telegram',
      color: 'hover:text-[#229ED9] hover:border-[#229ED9]/40 hover:bg-[#229ED9]/10',
    },
    {
      icon: Instagram,
      href: profile.social.instagram,
      label: 'Instagram',
      color: 'hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10',
    },
    {
      icon: Youtube,
      href: profile.social.youtube,
      label: 'YouTube',
      color: 'hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/10',
    },
  ]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'success' | 'fallback' | 'error'>('idle')
  const [loading, setLoading] = useState(false)

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setStatus('idle')

    try {
      await axios.post('/api/contact', formData)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setStatus('success')
      showToast('Your message was sent successfully!', 'success')
    } catch {
      // Graceful fallback: Open default email client so the message is never lost!
      const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(
        formData.subject || 'Portfolio Inquiry',
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
      )}`
      window.open(mailtoUrl, '_blank')
      setStatus('fallback')
      showToast('Opened email client to send your message directly!', 'info')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-24 relative overflow-hidden bg-base">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={content.contactEyebrow || '05 — Contact'}
            title={content.contactTitle || 'Get In Touch'}
            subtitle={
              content.contactSubtitle ||
              "I'm open to internships, collaboration, and software engineering opportunities."
            }
            centered
          />
        </Reveal>

        {/* ── Quick Mobile Actions Bar (Tap to email or telegram directly) ── */}
        <Reveal delay={0.05}>
          <div className="flex sm:hidden items-center justify-center gap-2 mb-6">
            <a
              href={`mailto:${profile.email}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-accent text-white font-medium text-xs shadow-md shadow-accent/20"
            >
              <Mail size={14} />
              <span>Email Me</span>
            </a>
            {profile.social.telegram && (
              <a
                href={profile.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-elevated border border-border text-primary font-medium text-xs hover:border-accent/40"
              >
                <Send size={14} className="text-[#229ED9]" />
                <span>Telegram</span>
              </a>
            )}
          </div>
        </Reveal>

        {/* ── Main Two-Column Contact Section ── */}
        <div className="grid lg:grid-cols-[1fr,1.15fr] gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Left Column: Direct Contact Info & Socials */}
          <Reveal delay={0.06} className="h-full">
            <div className="rounded-2xl bg-card border border-border/80 p-4 sm:p-6 md:p-8 flex flex-col justify-between space-y-5 h-full">
              <div className="space-y-4">
                {/* Status indicator badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Available for work · response &lt; 24h</span>
                </div>

                <p className="text-secondary text-xs sm:text-sm leading-relaxed text-left">
                  {content.contactIntro}
                </p>

                {/* Primary Email CTA Button on Tablet/Desktop */}
                <Button href={`mailto:${profile.email}`} size="md" fullWidth className="hidden sm:flex">
                  <Mail size={16} />
                  <span>{content.contactEmailButton || 'Send me an email'}</span>
                </Button>

                {/* Contact items */}
                <div className="space-y-2.5">
                  {contactMethods
                    .filter(({ value }) => value)
                    .map(({ icon: Icon, label, href, display, value }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-xl border border-border/70 hover:border-accent/30 bg-elevated/40 hover:bg-elevated/80 transition-all duration-200 group"
                      >
                        <a
                          href={href}
                          className="flex items-center gap-3 min-w-0 flex-1 select-text"
                        >
                          <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-accent/10 text-accent flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Icon size={15} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-mono text-[10px] text-muted uppercase tracking-wider">
                              {label}
                            </p>
                            <p className="text-primary text-xs sm:text-sm font-medium truncate group-hover:text-accent transition-colors">
                              {display}
                            </p>
                          </div>
                        </a>

                        {href !== '#' && (
                          <button
                            onClick={(e) => handleCopy(e, value, label)}
                            className="p-1.5 sm:p-2 rounded-lg text-secondary hover:text-accent hover:bg-elevated border border-transparent hover:border-border transition-colors flex-shrink-0"
                            title={`Copy ${label}`}
                            aria-label={`Copy ${label}`}
                          >
                            {copiedKey === label ? (
                              <Check size={14} className="text-emerald-400" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Social Channels Divider & Icons */}
              <div className="pt-2 sm:pt-4 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 h-px bg-border/80" />
                  <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
                    {content.contactSocialDivider || 'or connect on'}
                  </span>
                  <div className="flex-1 h-px bg-border/80" />
                </div>

                <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
                  {socialLinks
                    .filter(({ href }) => href)
                    .map(({ icon: Icon, href, label, color }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
                        className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-border/80 bg-elevated/40 text-secondary transition-all duration-200 ${color}`}
                      >
                        <Icon size={16} />
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Contact Message Form */}
          <Reveal delay={0.1} className="h-full">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-card border border-border/80 p-4 sm:p-6 md:p-8 space-y-3.5 sm:space-y-4 flex flex-col justify-between h-full"
            >
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-wider text-accent">
                  {content.contactFormEyebrow || 'Send a message'}
                </p>
                <h3 className="mt-1 font-display text-lg sm:text-xl md:text-2xl font-bold text-primary">
                  {content.contactFormTitle || "Let's build something"}
                </h3>
              </div>

              {/* Name & Email inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="block font-mono text-[11px] text-muted uppercase tracking-wide">
                    {content.contactNameLabel || 'Name'}
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full bg-elevated/70 border border-border/80 rounded-xl px-3.5 py-2.5 text-primary placeholder:text-muted/60 text-base sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder={content.contactNamePlaceholder || 'Your name'}
                  />
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <label className="block font-mono text-[11px] text-muted uppercase tracking-wide">
                    {content.contactEmailLabel || 'Email'}
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full bg-elevated/70 border border-border/80 rounded-xl px-3.5 py-2.5 text-primary placeholder:text-muted/60 text-base sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder={content.contactEmailPlaceholder || 'you@example.com'}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1 sm:space-y-1.5">
                <label className="block font-mono text-[11px] text-muted uppercase tracking-wide">
                  {content.contactSubjectLabel || 'Subject'}
                </label>
                <input
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className="w-full bg-elevated/70 border border-border/80 rounded-xl px-3.5 py-2.5 text-primary placeholder:text-muted/60 text-base sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-accent/50 focus:border-accent transition-all"
                  placeholder={content.contactSubjectPlaceholder || 'Project or job inquiry'}
                />
              </div>

              {/* Message (4 rows on mobile to keep form tight) */}
              <div className="space-y-1 sm:space-y-1.5">
                <label className="block font-mono text-[11px] text-muted uppercase tracking-wide">
                  {content.contactMessageLabel || 'Message'}
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={4}
                  className="w-full bg-elevated/70 border border-border/80 rounded-xl px-3.5 py-2.5 text-primary placeholder:text-muted/60 text-base sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-accent/50 focus:border-accent transition-all resize-none"
                  placeholder={content.contactMessagePlaceholder || 'Tell me about your project, idea, or role...'}
                />
              </div>

              {/* Status messages */}
              {status === 'success' && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs sm:text-sm text-emerald-400 flex items-center gap-2">
                  <Check size={15} />
                  <span>{content.contactSuccessMessage || 'Your message was sent successfully!'}</span>
                </div>
              )}

              {status === 'fallback' && (
                <div className="rounded-xl border border-accent/30 bg-accent/10 px-3.5 py-2 text-xs sm:text-sm text-accent flex items-center gap-2">
                  <Mail size={15} />
                  <span>Drafted into your email app to send directly!</span>
                </div>
              )}

              {status === 'error' && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs sm:text-sm text-red-400">
                  {content.contactErrorMessage || 'Something went wrong. Please try again.'}
                </div>
              )}

              <Button type="submit" size="md" fullWidth disabled={loading}>
                <Send size={15} />
                <span>
                  {loading
                    ? content.contactLoadingLabel || 'Sending...'
                    : content.contactSubmitButton || 'Send message'}
                </span>
              </Button>
            </form>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
