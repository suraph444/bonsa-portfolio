import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink,
  Github,
  ImageOff,
  ArrowUpRight,
  Sparkles,
  Layers,
  Code2,
  Monitor,
  Server,
  Search,
  X,
  Play,
  BookOpen,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import ProjectDetailsModal from '../ui/ProjectDetailsModal'
import AlgorithmVisualizerModal from '../ui/AlgorithmVisualizerModal'
import { useProjects } from '../../hooks/useProjects'
import { Project } from '../../types'

// Category styling config
const CATEGORY_STYLES: Record<
  string,
  { badge: string; border: string; glow: string; icon: typeof Layers }
> = {
  'Full-Stack': {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    border: 'hover:border-emerald-500/40',
    glow: 'group-hover:shadow-emerald-500/5',
    icon: Code2,
  },
  Frontend: {
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    border: 'hover:border-violet-500/40',
    glow: 'group-hover:shadow-violet-500/5',
    icon: Monitor,
  },
  Backend: {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    border: 'hover:border-amber-500/40',
    glow: 'group-hover:shadow-amber-500/5',
    icon: Server,
  },
}

function ProjectCard({
  project,
  onOpenDetails,
  onOpenVisualizer,
}: {
  project: Project
  onOpenDetails: (p: Project) => void
  onOpenVisualizer: () => void
}) {
  const categoryConfig = CATEGORY_STYLES[project.category || ''] || {
    badge: 'bg-accent/10 text-accent border-accent/25',
    border: 'hover:border-accent/40',
    glow: 'group-hover:shadow-accent/5',
    icon: Layers,
  }

  const isAlgoVisualizer =
    project.title.toLowerCase().includes('algorithm') ||
    project.title.toLowerCase().includes('dsa')

  return (
    <article
      className={`rounded-xl sm:rounded-2xl overflow-hidden bg-card border border-border/80 ${categoryConfig.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${categoryConfig.glow} flex flex-col group h-full`}
    >
      {/* Clickable Image Preview */}
      <div
        className="relative h-28 xs:h-32 sm:h-40 md:h-44 overflow-hidden bg-elevated cursor-pointer"
        onClick={() => onOpenDetails(project)}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              const fallback = e.currentTarget.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'flex'
            }}
          />
        ) : null}

        {/* Fallback */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-muted gap-1 bg-gradient-to-b from-card to-elevated"
          style={{ display: project.image ? 'none' : 'flex' }}
        >
          <ImageOff size={18} className="opacity-40" />
          <span className="font-mono text-[10px] opacity-50">Preview</span>
        </div>

        {/* Subtle vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-black/25 pointer-events-none" />

        {/* Category & Featured Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
          {project.category && (
            <span
              className={`px-1.5 py-0.5 text-[8.5px] sm:text-[10px] font-mono font-medium rounded-md border backdrop-blur-md shadow-sm flex items-center gap-1 ${categoryConfig.badge}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>{project.category}</span>
            </span>
          )}
          {project.featured && (
            <span className="hidden xs:inline-flex px-1.5 py-0.5 text-[8.5px] sm:text-[9.5px] font-mono font-semibold rounded-md bg-accent text-white items-center gap-0.5 shadow-sm">
              <Sparkles size={8} />
              Featured
            </span>
          )}
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white bg-black/80 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10 shadow">
            <span>Details</span>
            <ArrowUpRight size={12} />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3.5 md:p-4 gap-2 sm:gap-3 justify-between">
        <div className="space-y-1 sm:space-y-1.5">
          <h3
            onClick={() => onOpenDetails(project)}
            className="font-display font-semibold text-primary text-xs sm:text-sm md:text-base leading-snug group-hover:text-accent transition-colors cursor-pointer flex items-start justify-between gap-1"
          >
            <span className="line-clamp-2">{project.title}</span>
            <ArrowUpRight
              size={13}
              className="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5 hidden xs:inline-block"
            />
          </h3>
          <p className="text-secondary text-[10px] sm:text-xs leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap items-center gap-1">
          {project.technologies.slice(0, 2).map((tech) => (
            <span
              key={tech}
              className="font-mono text-[8.5px] sm:text-[9.5px] px-1.5 py-0.5 rounded bg-elevated text-secondary border border-border/70 truncate max-w-[85px] xs:max-w-none"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 2 && (
            <span className="font-mono text-[8.5px] sm:text-[9.5px] text-muted self-center px-0.5">
              +{project.technologies.length - 2}
            </span>
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between gap-1 pt-2 border-t border-border/60">
          <button
            onClick={() => onOpenDetails(project)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium bg-elevated hover:bg-accent/15 hover:text-accent text-secondary border border-border/80 transition-colors"
          >
            <BookOpen size={11} className="hidden xs:inline" />
            <span>Details</span>
          </button>

          <div className="flex items-center gap-1">
            {project.sourceUrl && (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View Source on GitHub"
                className="inline-flex items-center justify-center p-1 sm:p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-elevated border border-border/70 transition-colors"
              >
                <Github size={12} />
              </a>
            )}

            {isAlgoVisualizer ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenVisualizer()
                }}
                className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-medium bg-gradient-to-r from-accent to-accent/90 text-white hover:brightness-110 transition-all shadow-sm"
              >
                <Play size={10} className="fill-current" />
                <span>Demo</span>
              </button>
            ) : project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-medium bg-accent text-white hover:bg-accent/90 transition-colors shadow-sm"
              >
                <span>Live</span>
                <ExternalLink size={10} />
              </a>
            ) : (
              <span className="text-[9px] sm:text-[10px] font-mono text-muted/60 px-1 py-0.5">
                Soon
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

// Infer category from technologies when the API doesn't return one
function inferCategory(project: Project): Project {
  if (project.category) return project
  const tech = (project.technologies || []).map((t) => t.toLowerCase())
  const title = project.title.toLowerCase()
  const hasFrontend = tech.some((t) =>
    ['react', 'vue', 'angular', 'svelte', 'typescript', 'framer', 'tailwind', 'css', 'html'].includes(t)
  )
  const hasBackend = tech.some((t) =>
    ['node.js', 'express', 'django', 'flask', 'mysql', 'postgresql', 'mongodb', 'php', 'python', 'java', 'jwt', 'bcrypt'].includes(t)
  )
  const isFullStack =
    (hasFrontend && hasBackend) ||
    title.includes('campus') ||
    title.includes('registration') ||
    title.includes('full')
  const isBackend =
    !isFullStack &&
    (hasBackend || title.includes('backend') || title.includes('auth') || title.includes('rbac') || title.includes('api'))
  return {
    ...project,
    category: isFullStack ? 'Full-Stack' : isBackend ? 'Backend' : 'Frontend',
  }
}

export default function Projects() {
  const { projects: rawProjects, content } = useProjects()
  const projects = useMemo(() => rawProjects.map(inferCategory), [rawProjects])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false)

  // 4 main categories displayed strictly in 1 row on mobile
  const allCategories = ['All', 'Full-Stack', 'Frontend', 'Backend']

  // Filter projects based on category and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory

      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some((t) => t.toLowerCase().includes(query))

      return matchesCategory && matchesSearch
    })
  }, [projects, selectedCategory, searchQuery])

  const handleOpenDetails = (project: Project) => {
    setActiveProject(project)
    setIsModalOpen(true)
  }

  const handleCloseDetails = () => {
    setIsModalOpen(false)
    setActiveProject(null)
  }

  return (
    <section id="projects" className="py-14 sm:py-20 md:py-28 bg-base relative">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={content.projectsEyebrow || '03 — Projects'}
            title={content.projectsTitle || 'Featured Projects'}
            subtitle={
              content.projectsSubtitle ||
              "Things I've engineered across Full-Stack, Frontend, and Backend."
            }
          />
        </Reveal>

        {/* ── Category Filter Tabs (Single Row on Mobile, No Scroll) ── */}
        <Reveal delay={0.08}>
          <div className="mt-6 sm:mt-10 mb-6 sm:mb-8 space-y-3">
            {/* 4-column equal grid: Always strictly 1 line, NO horizontal scroll */}
            <div className="w-full max-w-2xl mx-auto">
              <div className="grid grid-cols-4 p-1 rounded-xl sm:rounded-2xl bg-card border border-border/80 shadow-sm w-full">
                {allCategories.map((cat) => {
                  const isSelected = selectedCategory === cat
                  const count =
                    cat === 'All'
                      ? projects.length
                      : projects.filter((p) => p.category === cat).length

                  const Icon =
                    cat === 'All'
                      ? Layers
                      : cat === 'Full-Stack'
                      ? Code2
                      : cat === 'Frontend'
                      ? Monitor
                      : Server

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`relative flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 rounded-lg sm:rounded-xl text-[10.5px] xs:text-xs sm:text-sm font-medium transition-colors text-center ${
                        isSelected
                          ? 'text-white'
                          : 'text-secondary hover:text-primary'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeProjectCategory"
                          className="absolute inset-0 rounded-lg sm:rounded-xl bg-accent shadow-md shadow-accent/25"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                      <Icon size={12} className="relative z-10 shrink-0 hidden xs:inline" />
                      <span className="relative z-10 truncate">{cat}</span>
                      <span
                        className={`relative z-10 text-[8.5px] sm:text-[10px] font-mono px-1 py-0.1 rounded-full hidden sm:inline ${
                          isSelected
                            ? 'bg-white/20 text-white font-semibold'
                            : 'bg-elevated text-muted'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Compact Search Bar */}
            <div className="relative w-full max-w-xs mx-auto">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                placeholder="Search PHP, React, MySQL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-card border border-border/80 hover:border-accent/40 focus:border-accent text-xs font-mono text-primary placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all text-center placeholder:text-center"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* ── Projects Grid: Two per phone mobile screen (grid-cols-2) ── */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-card/30 rounded-2xl border border-border/50">
            <Layers size={28} className="mx-auto text-muted/50 mb-2" />
            <p className="text-secondary font-medium text-xs sm:text-sm">
              No projects found in this category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="mt-2 text-xs font-mono text-accent hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <ProjectCard
                    project={project}
                    onOpenDetails={handleOpenDetails}
                    onOpenVisualizer={() => setIsVisualizerOpen(true)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </Container>

      {/* Case Study Deep-Dive Modal */}
      <ProjectDetailsModal
        project={activeProject}
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
      />

      {/* Interactive Algorithm Visualizer Modal */}
      <AlgorithmVisualizerModal
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
      />
    </section>
  )
}
