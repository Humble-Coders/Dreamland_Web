import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from './MotionVariants'

interface SectionHeadingProps {
  label: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  onDark?: boolean
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
  const lines = title.split('\n')

  return (
    <div className={`flex flex-col gap-3 ${center ? 'items-center text-center' : 'items-start text-left'}`}>
      {/* Ornamental label */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <span className="text-gold-400 text-xs">✦</span>
        <span className="text-xs font-medium tracking-[0.35em] text-gold-400 uppercase">{label}</span>
        <span className="text-gold-400 text-xs">✦</span>
      </motion.div>

      {/* Title — supports \n for line breaks */}
      <motion.h2
        variants={fadeUp}
        className={`font-display text-3xl leading-tight sm:text-4xl lg:text-6xl ${titleColor}`}
      >
        {lines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
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
          className={`text-sm leading-relaxed sm:text-base ${bodyColor} ${center ? 'mx-auto max-w-xl' : 'max-w-lg'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
