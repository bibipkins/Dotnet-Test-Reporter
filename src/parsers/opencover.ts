import { CoverageParser, ICoverageData, ICoverageModule } from '../data';
import { calculateCoverage, createCoverageModule, parseCoverage } from './common';

const parseOpencover: CoverageParser = async (filePath: string, threshold: number) =>
  parseCoverage(filePath, threshold, parseSummary, parseModules);

const parseSummary = (file: any): ICoverageData => {
  const summary = file.CoverageSession.Summary[0]['$'];

  return {
    linesTotal: Number(summary.numSequencePoints),
    linesCovered: Number(summary.visitedSequencePoints),
    lineCoverage: calculateCoverage(summary.visitedSequencePoints, summary.numSequencePoints),
    branchesTotal: Number(summary.numBranchPoints),
    branchesCovered: Number(summary.visitedBranchPoints),
    branchCoverage: calculateCoverage(summary.visitedBranchPoints, summary.numBranchPoints)
  };
};

const parseModules = (file: any, threshold: number): ICoverageModule[] => {
  const modules = (file.CoverageSession.Modules[0].Module ?? []) as any[];

  return modules.map(module => {
    const name = String(module.ModuleName[0]);
    const files = parseFiles(name, module);
    const classes = (module.Classes[0].Class ?? []) as any[];

    classes.forEach(c => {
      const methods = (c.Methods[0].Method ?? []) as any[];

      methods.forEach(m => {
        const file = files.find(f => f.id === m.FileRef[0]['$'].uid);
        const summary = m.Summary[0]['$'];
        const lines = (m.SequencePoints[0].SequencePoint ?? []) as any[];

        if (file) {
          file.linesTotal += Number(summary.numSequencePoints);
          file.linesCovered += Number(summary.visitedSequencePoints);
          file.branchesTotal += Number(summary.numBranchPoints);
          file.branchesCovered += Number(summary.visitedBranchPoints);
          file.linesToCover = file.linesToCover.concat(
            lines.filter(line => Number(line['$'].vc) > 0).map(line => Number(line['$'].sl))
          );
        }
      });
    });

    return createCoverageModule(name, threshold, files);
  });
};

const parseFiles = (moduleName: string, module: any) => {
  const fileData = (module.Files[0].File ?? []) as any[];

  return fileData.map(file => ({
    id: String(file['$'].uid),
    name: String(file['$'].fullPath).split(`${moduleName}\\`).slice(-1).pop() ?? '',
    linesTotal: 0,
    linesCovered: 0,
    lineCoverage: 0,
    branchesTotal: 0,
    branchesCovered: 0,
    branchCoverage: 0,
    linesToCover: Array<number>()
  }));
};

export default parseOpencover;
