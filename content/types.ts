export interface OccupationContent {
  meta: {
    occupationId: string
    occupationTitle: string
    displayName: string
    landingDescription: string
  }
  screenOne: {
    hookQuestion: string
    salary: {
      amount: number
      label: string
      source: string
    }
    stats: Array<{
      value: string
      label: string
    }>
  }
  screenTwo: {
    heading: string
    subtext: string
    instruction: string
    minSelections: number
    maxSelections: number
    tiles: Array<{
      id: string
      title: string
      description: string
      emoji: string
      illustrationPath: string
    }>
  }
  screenThree: {
    heading: string
    subtext: string
    employers: Array<{
      id: string
      name: string
      description: string
      employeeCount: number
      quote?: string
      logoPath?: string
      pinPosition: { lng: number; lat: number }
    }>
  }
  screenFour: {
    heading: string
    subtext: string
    steps: Array<{
      id: string
      title: string
      subtitle: string
      details: {
        courses?: string[]
        duration?: string
        earnings?: string
        programs?: string[]
        description: string
      }
    }>
  }
  screenFive: {
    heading: string
    subtext: string
    nameInputLabel: string
    nameInputPlaceholder: string
    iconSelectionLabel: string
    icons: Array<{
      id: string
      label: string
      svgPath: string
    }>
    downloadButtonLabel: string
  }
  screenSix: {
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
    myblueprintLink: {
      url: string
      label: string
    }
  }
}
