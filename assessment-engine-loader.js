/* Syntropix assessment engine compatibility loader.
 * Phase 1 of the monolith decomposition: external modules can register
 * assessment definitions without changing the runtime contract used by the
 * current UI. The existing inline assessmentBank remains the fallback until
 * each instrument is extracted and regression-verified.
 */
(function (global) {
  'use strict';
  const registry = new Map();
  const normalise = value => String(value || '').trim();

  function validateDefinition(name, definition) {
    const key = normalise(name);
    if (!key) throw new Error('Assessment registration requires a stable name.');
    if (!definition || typeof definition !== 'object') throw new Error(`Assessment ${key} must be an object.`);
    if (!Array.isArray(definition.questions) || definition.questions.length === 0) throw new Error(`Assessment ${key} requires questions.`);
    const ids = new Set();
    for (const q of definition.questions) {
      if (q == null || q.id == null || !normalise(q.dim) || !normalise(q.text)) throw new Error(`Assessment ${key} has an invalid question.`);
      if (ids.has(q.id)) throw new Error(`Assessment ${key} contains duplicate question id ${q.id}.`);
      ids.add(q.id);
    }
    return key;
  }

  function register(name, definition) {
    const key = validateDefinition(name, definition);
    if (registry.has(key)) throw new Error(`Assessment ${key} is already registered.`);
    registry.set(key, Object.freeze(definition));
    return definition;
  }

  function get(name) { return registry.get(normalise(name)) || null; }
  function has(name) { return registry.has(normalise(name)); }
  function names() { return Array.from(registry.keys()); }

  global.SyntropixAssessmentEngine = Object.freeze({ register, get, has, names, validateDefinition });
})(window);
