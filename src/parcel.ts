import { Optimizer } from '@parcel/plugin';
import { compile } from './compile';

export default new Optimizer({
  async optimize({ contents }) {
    const source = contents.toString();
    const { code } = compile(source);
    return { contents: code };
  },
});
