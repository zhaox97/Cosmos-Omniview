import random
import string
import json

def label():
    return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(7))

def lat(lb, ub):
    return (random.SystemRandom().random() * (ub - lb)) + lb

def lon(lb, ub):
    return (random.SystemRandom().random() * (ub - lb)) + lb

def main():
    data = []
    N = int(input('Count: '))
    DEST = input('Save as: ') or 'data.json'
    LATUB = float(input('Lat upper bound: '))
    LONUB = float(input('Long upper bound: '))
    LATLB = float(input('Lat lower bound: '))
    LONLB = float(input('Long lower bound: '))
    print('Generating...')
    for _ in range(N):
        l = label()
        pos = [lat(LATLB, LATUB), lon(LONLB, LONUB)]
        o = {'label': l, 'pos': pos}
        data.append(o)
    print('done. Saved as', DEST)
    f = open(DEST, 'w')
    f.write(json.dumps(data))
    f.close()

try:
    main()
except KeyboardInterrupt:
    print('\nAbort.')
