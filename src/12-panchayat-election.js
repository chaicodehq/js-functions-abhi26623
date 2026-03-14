/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  const votes = {}; // candidateId -> vote count
  const registeredVoters = new Set();
  const votedVoters = new Set();
  const validCandidates = new Map();
  
  if (Array.isArray(candidates)) {
    for (const c of candidates) {
      if (c && c.id) {
        validCandidates.set(c.id, { ...c });
        votes[c.id] = 0;
      }
    }
  }

  return {
    registerVoter(voter) {
      if (!voter || typeof voter !== 'object') return false;
      if (!voter.id || !voter.name || typeof voter.age !== 'number' || voter.age < 18) return false;
      if (registeredVoters.has(voter.id)) return false;
      
      registeredVoters.add(voter.id);
      return true;
    },

    castVote(voterId, candidateId, onSuccess, onError) {
      if (typeof onSuccess !== 'function' || typeof onError !== 'function') return null;

      if (!registeredVoters.has(voterId)) {
        return onError("Voter not registered");
      }
      
      if (!validCandidates.has(candidateId)) {
        return onError("Candidate not found");
      }
      
      if (votedVoters.has(voterId)) {
        return onError("Voter already voted");
      }
      
      votedVoters.add(voterId);
      votes[candidateId]++;
      
      return onSuccess({ voterId, candidateId });
    },

    getResults(sortFn) {
      const results = [];
      for (const [id, c] of validCandidates.entries()) {
        results.push({ ...c, votes: votes[id] });
      }
      
      if (typeof sortFn === 'function') {
        results.sort(sortFn);
      } else {
        results.sort((a, b) => b.votes - a.votes);
      }
      return results;
    },

    getWinner() {
      let maxVotes = -1;
      let winnerId = null;
      let totalVotesCast = 0;
      
      for (const [id, count] of Object.entries(votes)) {
        totalVotesCast += count;
        if (count > maxVotes) {
          maxVotes = count;
          winnerId = id;
        }
      }
      
      if (totalVotesCast === 0 || winnerId === null) return null;
      
      const c = validCandidates.get(winnerId);
      return { ...c, votes: maxVotes };
    }
  };
}

export function createVoteValidator(rules) {
  return function(voter) {
    if (!voter || typeof voter !== 'object') {
      return { valid: false, reason: "Invalid voter object" };
    }
    
    if (rules && Array.isArray(rules.requiredFields)) {
      for (const field of rules.requiredFields) {
        // According to instructions, if missing required fields it's invalid
        if (!(field in voter)) {
          return { valid: false, reason: `Missing required field: ${field}` };
        }
      }
    }
    
    if (rules && typeof rules.minAge === 'number') {
      if (typeof voter.age !== 'number' || voter.age < rules.minAge) {
        return { valid: false, reason: `Age must be at least ${rules.minAge}` };
      }
    }
    
    return { valid: true };
  };
}

export function countVotesInRegions(regionTree) {
  if (!regionTree || typeof regionTree !== 'object') return 0;
  
  let total = 0;
  if (typeof regionTree.votes === 'number') {
    total += regionTree.votes;
  }
  
  if (Array.isArray(regionTree.subRegions)) {
    for (const sub of regionTree.subRegions) {
      total += countVotesInRegions(sub);
    }
  }
  
  return total;
}

export function tallyPure(currentTally, candidateId) {
  if (!currentTally || typeof currentTally !== 'object') return { [candidateId]: 1 };
  if (!candidateId || typeof candidateId !== 'string') return { ...currentTally };
  
  const newTally = { ...currentTally };
  newTally[candidateId] = (newTally[candidateId] || 0) + 1;
  return newTally;
}
