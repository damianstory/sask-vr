export interface OccupationContent {
  meta: {
    occupationId: string
    occupationTitle: string
    displayName: string
    landingDescription: string
  }
  salaryHook: {
    hookQuestion: string
    salary: {
      amount: number
      label: string
      source: string
      seasonalityNote?: string
    }
    hourlyRange: { entry: number; median: number; senior: number }
    annualRange: { entry: number; median: number; senior: number }
    selfEmployment: { percentage: number; potentialEarnings: string }
    stats: Array<{
      value: string
      label: string
      eyebrow?: string
    }>
  }
  taskRanking: {
    heading: string
    subtext: string
    instruction: string
    reveal: { heading: string; subtext: string }
    tiles: Array<{
      id: string
      title: string
      description: string
      emoji: string
      illustrationPath: string
      weight?: number
    }>
  }
  employerMap: {
    heading: string
    subtext: string
    employers: Array<{
      id: string
      name: string
      description: string
      employeeCount: number
      specialty?: string
      quote?: string
      logoPath?: string
      pinPosition: { lng: number; lat: number }
    }>
  }
  careerPathway: {
    heading: string
    subtext: string
    steps: Array<{
      id: string
      title: string
      subtitle: string
      optional?: boolean
      details: {
        courses?: string[]
        duration?: string
        earnings?: string
        programs?: string[]
        description: string
        headStart?: Array<{
          program: string
          hours: number
        }>
      }
    }>
  }
  videoSnippets: {
    heading: string
    subtext: string
    videos: Array<{
      id: string
      title: string
      youtubeId: string
    }>
  }
  speedRun: {
    heading: string
    subtext: string
    disclaimer: string
    carpenter: {
      milestones: Array<{
        year: number
        label: string
        value: string
      }>
    }
    university: {
      milestones: Array<{
        year: number
        label: string
        value: string
      }>
    }
  }
  aiSorting: {
    heading: string
    subtext: string
    punchline: string
    tasks: Array<{
      id: string
      description: string
      correctAnswer: 'ai' | 'human'
      explanation: string
    }>
  }
  vrPrep: {
    heading: string
    subtext: string
    prompts: Array<{
      id: string
      text: string
    }>
  }
  postVr: {
    congratsHeading: string
    congratsSubtext: string
    checklistHeading: string
    checklist: Array<{
      id: string
      label: string
    }>
    reflectionHeading: string
    reflectionSubtext: string
    reflections: Array<{
      id: string
      statement: string
    }>
    myblueprintLink: {
      url: string
      label: string
    }
    survey: {
      heading: string
      subtext: string
      formUrl: string
      legendHeading: string
      legend: Array<{
        value: number
        label: string
      }>
    }
  }
}
