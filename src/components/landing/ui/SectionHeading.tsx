// Reusable section heading used by every landing section.
// Renders an ornamental label, a large display title, optional subtitle,
// and a decorative gold divider — all as Framer Motion children so the
// parent's stagger variant animates them in sequence.
import { motion } from 'framer-motion'
import { fadeUp } from './MotionVariants'

interface SectionHeadingProps {
  label: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  onDark?: boolean // true (default) = cream text; false = dark text for light bg
}

export default function SectionHeading({
  label,
  title,
  subtitle,
  align = 'center',
  onDark = true,
}: SectionHeadingProps) {
  const center = align === 'center'
  const titleColor = onDark ? 'text-cream' : 'text-forest-950'
  const bodyColor = onDark ? 'text-cream/55' : 'text-forest-800/70'

  return (
    <div className={`flex flex-col gap-3 ${center ? 'items-center text-center' : 'items-start text-left'}`}>
      {/* Ornamental label */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <span className="text-gold-400 text-xs">✦</span>
        <span className="text-xs font-medium tracking-[0.35em] text-gold-400 uppercase">{label}</span>
        <span className="text-gold-400 text-xs">✦</span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUp}
        className={`font-display text-4xl leading-tight sm:text-5xl lg:text-6xl ${titleColor}`}
      >
        {title}
      </motion.h2>

      {/* Gold divider */}
      <motion.div
        variants={fadeUp}
        className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`}
      >
        <div className="h-px w-10 bg-gold-500/40" />
        <span className="text-[10px] text-gold-500/60">◈</span>
        <div className="h-px w-10 bg-gold-500/40" />
      </motion.div>

      {/* Optional subtitle */}
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className={`text-base leading-relaxed ${bodyColor} ${center ? 'mx-auto max-w-xl' : 'max-w-lg'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
