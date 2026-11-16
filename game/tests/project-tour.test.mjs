import test from 'node:test';
import assert from 'node:assert/strict';
import {createProjectTour} from '../project-tour.js';

test('Project showcase supports automatic progress, pause, previous, next and early finish',()=>{
 let finished=0;const seen=[];const tour=createProjectTour({projects:[{name:'A'},{name:'B'},{name:'C'}],seconds:3,ui:s=>seen.push(s.project?.name),onComplete:()=>finished++});
 tour.start();assert.equal(tour.state.project.name,'A');tour.update(3,true);assert.equal(tour.state.index,0);tour.update(3);assert.equal(tour.state.project.name,'B');tour.previous();assert.equal(tour.state.project.name,'A');tour.next();tour.next();assert.equal(tour.state.project.name,'C');tour.update(3);assert(tour.state.completed&&!tour.state.active);assert.equal(finished,1);tour.finish();assert.equal(finished,1);tour.start();tour.finish();assert.equal(finished,2);tour.close();assert(!tour.state.active&&!tour.state.completed);assert(seen.includes('C'));
});
