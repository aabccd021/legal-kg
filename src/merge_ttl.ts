import { readFileSync, writeFileSync } from 'fs';
import { getDocumentData, nodeToFile } from './util';

// find md -type f | wc -l
//yarn ts-node src/merge_ttl.ts && sort --reverse uuri_unsorted.ttl | uniq > ../uuri/uuri.ttl
// head -n 5 uuri.ttl

const { prefix, triples } = getDocumentData('ttl').reduce<{ prefix: string[]; triples: string[] }>(
  (prev, node) => {
    console.log(prev.triples.length);
    const ttlFile = nodeToFile('ttl', node);
    const { prefix, triples } = readFileSync(ttlFile.path, 'utf-8')
      .split('\n')
      .reduce<{ prefix: string[]; triples: string[]; isTripleLine: boolean }>(
        (prev, line) => {
          if (prev.isTripleLine)
            return {
              ...prev,
              triples: [...prev.triples, line],
            };
          if (line === '')
            return {
              ...prev,
              isTripleLine: true,
            };
          return {
            ...prev,
            prefix: [...prev.prefix, line],
          };
        },
        { prefix: [], triples: [], isTripleLine: false }
      );
    return {
      prefix: [...prev.prefix, ...prefix],
      triples: [...prev.triples, ...triples],
    };
  },
  { prefix: [], triples: [] }
);

writeFileSync('uuri_unsorted.ttl', [...prefix, '', ...triples].join('\n'));
