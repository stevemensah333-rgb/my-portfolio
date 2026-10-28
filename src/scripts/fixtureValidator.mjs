/** Local demonstration only. This is a small subset of the source contract,
 * not Syncareer's production validator or a semantic truth checker. */
export function inspectFixture(raw, suppliedIds) {
 let proposal;
 try { proposal = JSON.parse(raw); } catch { return {ok:false,reason:'model_not_json',message:'The reply is prose. A JSON proposal is required.'}; }
 if (!proposal || proposal.kind !== 'rewrite' || typeof proposal.text !== 'string' || !proposal.text.trim()) return {ok:false,reason:'model_shape',message:'A non-empty rewrite proposal is required.'};
 if (!Array.isArray(proposal.sourceContextIds) || !proposal.sourceContextIds.length || proposal.sourceContextIds.some(id => typeof id !== 'string' || !suppliedIds.includes(id))) return {ok:false,reason:'model_unknown_source_id',message:'Every citation must refer to supplied context.'};
 if (!proposal.sourceContextIds.some(id=>id.startsWith('requirement-')) || !proposal.sourceContextIds.some(id=>id.startsWith('evidence-'))) return {ok:false,reason:'model_missing_grounding',message:'Cite both a supplied requirement and supplied evidence.'};
 return {ok:true,reason:'review_required',message:'Shape and citations pass these local checks. A person must still review the claim.'};
}
