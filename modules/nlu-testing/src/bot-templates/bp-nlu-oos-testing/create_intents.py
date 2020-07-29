import json
import os

if not os.path.exists('./intents'):
    os.mkdir('./intents')

with open('./raw_set.json', 'r') as json_file:
    dataset = json.load(json_file)

train_set = dataset['train']+dataset['val'] + \
    dataset['oos_train']+dataset['oos_val']
train_intents = set([elt[1] for elt in train_set])

for intent in train_intents:
    intent_dic = {"name": intent,
                  "utterances": {'en': []},
                  "slots": [],
                  "contexts": "*"}
    for train_utt, train_intent in train_set:
        if train_intent == intent:
            intent_dic["utterances"]["en"].append(train_utt)

    with open(f'./intents/{intent}.json', 'w+') as intent_file:
        json.dump(intent_dic, intent_file)