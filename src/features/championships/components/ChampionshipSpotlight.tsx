import { motion } from 'motion/react'

import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { ChampionshipGoals } from '@/features/goals/components/ChampionshipGoals/ChampionshipGoals'
import type { Championship } from '../types/championships'
import { FOOTBALL_FORMAT_LABEL, FOOTBALL_FORMAT_LONG_LABEL } from '../utils/championshipLabels'
import { ChampionshipHonor } from './ChampionshipHonor'
import { ChampionshipStats } from './ChampionshipStats'
import { ChampionshipTeamPhoto } from './ChampionshipTeamPhoto'
import { FinalVideo } from './FinalVideo'
import { MatchResults } from './MatchResults'
import { ScorersTable } from './ScorersTable'
import { TournamentLogo } from './TournamentLogo'

export type ChampionshipSpotlightProps = {
  championship: Championship
  position: number
  total: number
}

/**
 * Detailed view of the selected championship: identity, distinction, team
 * photo, statistics, scorers, results and the final video when available. All
 * data belongs to a single championship of a single format.
 */
export function ChampionshipSpotlight({
  championship,
  position,
  total,
}: ChampionshipSpotlightProps) {
  const { format, name, season, year, finalVideo, matches, scorers, stats } = championship
  const seasonLabel =
    season && year ? `${season} ${year}` : (season ?? (year ? String(year) : undefined))

  return (
    <motion.article
      key={championship.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8"
    >
      <header className="flex items-start gap-4 sm:gap-5">
        <TournamentLogo championship={championship} size="lg" className="shrink-0" />
        <div className="min-w-0">
          <Text as="p" size="sm" tone="brand" weight="semibold" className="tracking-wide uppercase">
            Campeonatos {FOOTBALL_FORMAT_LABEL[format]}
            <span className="sr-only"> — {FOOTBALL_FORMAT_LONG_LABEL[format]}</span>
          </Text>
          <Heading as="h2" size="display-sm" className="mt-1">
            {name}
          </Heading>
          <Text as="p" size="md" tone="secondary" className="mt-1">
            {[seasonLabel, championship.league].filter(Boolean).join(' · ')}
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            {position} de {total} campeonatos
          </Text>
        </div>
      </header>

      <ChampionshipHonor
        honorType={championship.honorType}
        trophyTier={championship.trophyTier}
        resultLabel={championship.resultLabel}
        className="self-start"
      />

      <section aria-label="Estadísticas del campeonato">
        <Heading as="h3" size="lg" className="mb-3">
          Estadísticas
        </Heading>
        <ChampionshipStats stats={stats} hasMatches={matches.length > 0} />
      </section>

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div>
          <ChampionshipTeamPhoto championship={championship} priority />
        </div>
        <section aria-label="Resultados">
          <Heading as="h3" size="lg" className="mb-3">
            Resultados
          </Heading>
          <MatchResults key={`${championship.id}-matches`} matches={matches} />
        </section>
      </div>

      {finalVideo ? (
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <section aria-label="Goleadores">
            <Heading as="h3" size="lg" className="mb-3">
              Goleadores
            </Heading>
            <ScorersTable key={`${championship.id}-scorers`} scorers={scorers} />
          </section>
          <section aria-label="Video de la final">
            <Heading as="h3" size="lg" className="mb-3">
              La final
            </Heading>
            <FinalVideo
              key={`${championship.id}-video`}
              video={finalVideo}
              championshipName={name}
            />
          </section>
        </div>
      ) : (
        <section aria-label="Goleadores" className="mx-auto w-full max-w-2xl">
          <Heading as="h3" size="lg" className="mb-3">
            Goleadores
          </Heading>
          <ScorersTable key={`${championship.id}-scorers`} scorers={scorers} />
        </section>
      )}

      <ChampionshipGoals championshipId={championship.id} format={format} />
    </motion.article>
  )
}
