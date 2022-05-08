import all from "it-all";
import { useEffect, useState } from "react"
import useIpfs from "./use-ipfs";
import { MFSEntry, StatResult } from 'ipfs-core-types/src/files'

export function useLs(path: string): [MFSEntry[]|undefined, any] {
  const {ipfs} = useIpfs();
  const [entries, setEntries] = useState<MFSEntry[]>();
  const [error, setError] = useState<any>(null);


  useEffect(() => {
    console.log('called ls');
    (async function() {
      if(!ipfs) return setError("IPFS not initiaized!");
      try {
        const entries = await all(ipfs.files.ls(path));
        if(entries) setEntries(entries);
        else setEntries(undefined);
      }catch (error) {
        setEntries(undefined);
        setError(error);
      }
    })()
  }, [ipfs, path]);

  return [entries, error]
}

export function useStat(path: string): [StatResult|undefined, any] {
  const {ipfs} = useIpfs();
  const [stat, setStat] = useState<StatResult>();
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    console.log('called ');
    (async function() {
      if(!ipfs) return setError("IPFS not initiaized!");
      ipfs.files.stat(path)
        .then(stat => setStat(stat))
    })()
  }, [ipfs, path])

  return [stat, error];
}

export function useMkdir(): [ (path: string) => Promise<void>, any ] {
  const {ipfs} = useIpfs();
  const [error, setError] = useState<any>(null);

  async function mkdir(path: string) {
    if(!ipfs) return setError("IPFS not initiaized!");
    try {
      await ipfs.files.mkdir(path);
    }catch (error) {
      console.log('make dir error! ' + error)
      setError(error);
    }
  }

  return [mkdir, error]
}