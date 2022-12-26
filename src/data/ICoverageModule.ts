export default interface ICoverageModule {
  name: string;
  coverage: number;
  files: {
    id: string;
    name: string;
    linesTotal: number;
    linesCovered: number;
    lineCoverage: number;
    branchesTotal: number;
    branchesCovered: number;
    branchCoverage: number;
  }[];
}
