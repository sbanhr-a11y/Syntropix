/* Syntropix assessment-engine parity gate.
 * Non-invasive: compares extracted definitions with the legacy assessmentBank.
 * It does not change runtime selection or scoring.
 */
(function (global) {
  'use strict';

  function stable(value) {
    if (Array.isArray(value)) return value.map(stable);
    if (value && typeof value === 'object') {
      return Object.keys(value).sort().reduce((out, key) => {
        const v = value[key];
        if (typeof v !== 'function' && typeof v !== 'undefined') out[key] = stable(v);
        return out;
      }, {});
    }
    return value;
  }

  function questionFingerprint(q) {
    return {
      id: q.id,
      dim: String(q.dim || '').trim(),
      text: String(q.text || '').trim(),
      rev: Boolean(q.rev)
    };
  }

  function definitionFingerprint(definition) {
    if (!definition || !Array.isArray(definition.questions)) return null;
    return stable({
      title: definition.title || null,
      introHeader: definition.introHeader || null,
      introBody: definition.introBody || null,
      questions: definition.questions.map(questionFingerprint),
      phases: definition.phases || null,
      dimensionData: definition.dimensionData || null,
      archetypes: definition.archetypes || null
    });
  }

  function compare(name, legacyDefinition, extractedDefinition) {
    const legacy = definitionFingerprint(legacyDefinition);
    const extracted = definitionFingerprint(extractedDefinition);
    const errors = [];
    if (!legacy) errors.push('Legacy definition is missing or malformed.');
    if (!extracted) errors.push('Extracted definition is missing or malformed.');
    if (!errors.length && JSON.stringify(legacy) !== JSON.stringify(extracted)) {
      errors.push('Definition fingerprint differs from the legacy source.');
    }
    return Object.freeze({ name, ok: errors.length === 0, errors });
  }

  function assertParity(name, legacyDefinition, extractedDefinition) {
    const result = compare(name, legacyDefinition, extractedDefinition);
    if (!result.ok) throw new Error(`Assessment parity failed for ${name}: ${result.errors.join(' ')}`);
    return result;
  }

  global.SyntropixAssessmentParity = Object.freeze({ compare, assertParity, definitionFingerprint });
})(window);
