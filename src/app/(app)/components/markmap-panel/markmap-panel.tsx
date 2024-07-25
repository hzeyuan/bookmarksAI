import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Markmap } from 'markmap-view';
import { transformer } from './markmap';
import Grid from '@src/components/ui/grid';
import { motion } from "framer-motion";

export interface MarkmapHooksRef {
  fit: () => void;
  setData: (data: any) => void;
  updateMarkmap: (newMd: string) => void;
}

interface MarkmapHooksProps {
  md?: string;
}

const MarkmapPanel = forwardRef<MarkmapHooksRef, MarkmapHooksProps>(({ md }, ref) => {
  const [value, setValue] = useState(md || '');
  const refSvg = useRef<SVGSVGElement>(null);
  const refMm = useRef<Markmap>();

  useEffect(() => {
    const mm = Markmap.create(refSvg.current);
    refMm.current = mm;
  }, []);

  useEffect(() => {
    if (refMm.current) {
      const { root } = transformer.transform(value);
      refMm.current.setData(root);
      refMm.current.fit();
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    fit: () => {
      if (refMm.current) {
        refMm.current.fit();
      }
    },
    setData: (data: any) => {
      if (refMm.current) {
        refMm.current.setData(data);
      }
    },
    updateMarkmap: (newMd: string) => {
      setValue(newMd);
    }
  }));

  return (
    <motion.div className='w-full h-full'>
      <Grid>
        <svg className='w-full h-full' ref={refSvg} />
      </Grid>
    </motion.div>
  );
});

export default MarkmapPanel;