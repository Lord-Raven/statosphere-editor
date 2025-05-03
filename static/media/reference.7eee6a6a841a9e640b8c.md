These are just some brief notes to keep in mind, to tide folks over 'til I can more properly document things:

This stage comprises five core elements:

* Variable definitions with various update phases
* JavaScript function definitions for creating complex, re-usable logic
* Zero-shot classification rules to draw inferences from inputs or responses and apply updates to variables as a result
* Generators which make LLM calls to request additional content
* Content modification rules which alter input, response, post-input/response (which are \"system messages\" that display in-chat but do not persist to the LLM), and stage directions (additional LLM instruction), all based on specified conditions


**Notes on logic, variables, functions, etc.**

* With the exception of the Functions section, most value/condition/update fields in this configuration are evaluated mathematical statements which use [MathJS](https://mathjs.org/index.html).
  * Look at the [functions supported by MathJS](https://mathjs.org/docs/reference/functions.html), as it's quite robust out of the box.
  * Surround string values with quotation marks (or else MathJS will try to evaluate them). 
  * You can reference your defined variables by name outside of strings. 
  * You can also reference variables both inside and outside of strings by surrounding them with double braces (e.g., \"{{someVariable}}\"); this substitution is performed by the stage before evaluation. 
  * You can use {{user}}, {{char}}, and {{content}} (which varies contextually). 
  * Statosphere has MathJS set to handle matrices as arrays, but MathJS uses one-based array indexing, which will differ from when you reference those arrays in your defined JavaScript functions.
* The Functions section allows you to define JavaScript functions, which can then be leveraged in any of the other evaluated fields.
  * These functions can reference any of your defined functions or variables; the stage attempts to identify dependencies and inject these values as parameters.
  * As a result, be thoughtful with parameter, variable, and function names.
  * These functions cannot update stage variable values; these are effectively injected by value.

If you have other questions about this stage or stages in general, feel free to DM me on the Chub Discord: ravenok31.

**Order of Operations**

For reference, the rules on this stage are applied in this order:
* User submits input
  * Initial input variable operations are performed, in the order that variables are defined
  * Classifiers with an input hypothesis and Input-phase generators are run, in the order that they are defined (generators first), unless they have dependencies
  * Final input variable operations are performed, in the order that variables are defined
  * Input content modifications are executed, in the order that these modifications are defined
  * Post-input message content modifications are executed, in the order that these modifications are defined
  * Stage direction modifications are executed, in the order that these modifications are defined
* Bot returns response
  * Initial response variable operations are performed, in the order that variables are defined
  * Classifiers with a response hypothesis and Response-phase generators are run, in the order that they are defined (generators first), unless they have dependencies
  * Final response variable operations are performed, in the order that variables are defined
  * Response content modifications are executed, in the order that these modifications are defined
  * Post-response message modifications are executed, in the order that these modifications are defined

**Inference Details**

This UI makes API calls to the same [Hugging Face Space](https://huggingface.co/spaces/Ravenok/statosphere-backend) 
that the stage leverages, so you can test classifiers while building your configuration. 
You should keep in mind that the tool doesn't know your character or usernames and will substitute generic 
names into {{char}} and {{user}} tags. So if you used {{char}} and the actual character's name interchangeably, 
the classifier is unlikely to give good results within the tester.

You aren't going to get you great results without carefully tuned prompts/labels/hypotheses/thresholds; 
it can be a struggle to get consistently decent evaluations, so this can become a weakpoint in the stage.
