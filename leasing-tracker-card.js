var vt = Object.defineProperty;
var At = (r, t, e) => t in r ? vt(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var A = (r, t, e) => At(r, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, F = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), Q = /* @__PURE__ */ new WeakMap();
let ct = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (F && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Q.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Q.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const bt = (r) => new ct(typeof r == "string" ? r : r + "", void 0, K), dt = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[n + 1], r[0]);
  return new ct(e, r, K);
}, Et = (r, t) => {
  if (F) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = D.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, X = F ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return bt(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: St, defineProperty: wt, getOwnPropertyDescriptor: Ct, getOwnPropertyNames: xt, getOwnPropertySymbols: Pt, getPrototypeOf: Ut } = Object, _ = globalThis, Y = _.trustedTypes, Tt = Y ? Y.emptyScript : "", B = _.reactiveElementPolyfillSupport, P = (r, t) => r, L = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? Tt : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, Z = (r, t) => !St(r, t), tt = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), _.litPropertyMetadata ?? (_.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let b = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = tt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && wt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: n } = Ct(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const a = i == null ? void 0 : i.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = Ut(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, s = [...xt(e), ...Pt(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(X(i));
    } else t !== void 0 && e.push(X(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Et(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var n;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : L).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const a = s.getPropertyOptions(i), h = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((n = a.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? a.converter : L;
      this._$Em = i;
      const c = h.fromAttribute(e, a.type);
      this[i] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, n) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (i === !1 && (n = this[t]), s ?? (s = a.getPropertyOptions(t)), !((s.hasChanged ?? Z)(n, e) || s.useDefault && s.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, o] of i) {
        const { wrapped: a } = o, h = this[n];
        a !== !0 || this._$AL.has(n) || h === void 0 || this.C(n, void 0, o, h);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[P("elementProperties")] = /* @__PURE__ */ new Map(), b[P("finalized")] = /* @__PURE__ */ new Map(), B == null || B({ ReactiveElement: b }), (_.reactiveElementVersions ?? (_.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, et = (r) => r, z = U.trustedTypes, st = z ? z.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, ut = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, pt = "?" + f, Nt = `<${pt}>`, v = document, T = () => v.createComment(""), N = (r) => r === null || typeof r != "object" && typeof r != "function", J = Array.isArray, Ot = (r) => J(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", q = `[ 	
\f\r]`, x = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, it = /-->/g, rt = />/g, g = RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), nt = /'/g, ot = /"/g, $t = /^(?:script|style|textarea|title)$/i, kt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), j = kt(1), S = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), m = v.createTreeWalker(v, 129);
function ft(r, t) {
  if (!J(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const Mt = (r, t) => {
  const e = r.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = x;
  for (let a = 0; a < e; a++) {
    const h = r[a];
    let c, d, l = -1, p = 0;
    for (; p < h.length && (o.lastIndex = p, d = o.exec(h), d !== null); ) p = o.lastIndex, o === x ? d[1] === "!--" ? o = it : d[1] !== void 0 ? o = rt : d[2] !== void 0 ? ($t.test(d[2]) && (i = RegExp("</" + d[2], "g")), o = g) : d[3] !== void 0 && (o = g) : o === g ? d[0] === ">" ? (o = i ?? x, l = -1) : d[1] === void 0 ? l = -2 : (l = o.lastIndex - d[2].length, c = d[1], o = d[3] === void 0 ? g : d[3] === '"' ? ot : nt) : o === ot || o === nt ? o = g : o === it || o === rt ? o = x : (o = g, i = void 0);
    const $ = o === g && r[a + 1].startsWith("/>") ? " " : "";
    n += o === x ? h + Nt : l >= 0 ? (s.push(c), h.slice(0, l) + ut + h.slice(l) + f + $) : h + f + (l === -2 ? a : $);
  }
  return [ft(r, n + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class O {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const a = t.length - 1, h = this.parts, [c, d] = Mt(t, e);
    if (this.el = O.createElement(c, s), m.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (i = m.nextNode()) !== null && h.length < a; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const l of i.getAttributeNames()) if (l.endsWith(ut)) {
          const p = d[o++], $ = i.getAttribute(l).split(f), R = /([.?@])?(.*)/.exec(p);
          h.push({ type: 1, index: n, name: R[2], strings: $, ctor: R[1] === "." ? Rt : R[1] === "?" ? Dt : R[1] === "@" ? Lt : I }), i.removeAttribute(l);
        } else l.startsWith(f) && (h.push({ type: 6, index: n }), i.removeAttribute(l));
        if ($t.test(i.tagName)) {
          const l = i.textContent.split(f), p = l.length - 1;
          if (p > 0) {
            i.textContent = z ? z.emptyScript : "";
            for (let $ = 0; $ < p; $++) i.append(l[$], T()), m.nextNode(), h.push({ type: 2, index: ++n });
            i.append(l[p], T());
          }
        }
      } else if (i.nodeType === 8) if (i.data === pt) h.push({ type: 2, index: n });
      else {
        let l = -1;
        for (; (l = i.data.indexOf(f, l + 1)) !== -1; ) h.push({ type: 7, index: n }), l += f.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = v.createElement("template");
    return s.innerHTML = t, s;
  }
}
function w(r, t, e = r, s) {
  var o, a;
  if (t === S) return t;
  let i = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const n = N(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((a = i == null ? void 0 : i._$AO) == null || a.call(i, !1), n === void 0 ? i = void 0 : (i = new n(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = w(r, i._$AS(r, t.values), i, s)), t;
}
class Ht {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? v).importNode(e, !0);
    m.currentNode = i;
    let n = m.nextNode(), o = 0, a = 0, h = s[0];
    for (; h !== void 0; ) {
      if (o === h.index) {
        let c;
        h.type === 2 ? c = new H(n, n.nextSibling, this, t) : h.type === 1 ? c = new h.ctor(n, h.name, h.strings, this, t) : h.type === 6 && (c = new zt(n, this, t)), this._$AV.push(c), h = s[++a];
      }
      o !== (h == null ? void 0 : h.index) && (n = m.nextNode(), o++);
    }
    return m.currentNode = v, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class H {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = w(this, t, e), N(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ot(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && N(this._$AH) ? this._$AA.nextSibling.data = t : this.T(v.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = O.createElement(ft(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(e);
    else {
      const o = new Ht(i, this), a = o.u(this.options);
      o.p(e), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const n of t) i === e.length ? e.push(s = new H(this.O(T()), this.O(T()), this, this.options)) : s = e[i], s._$AI(n), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = et(t).nextSibling;
      et(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class I {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, n) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(t, e = this, s, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = w(this, t, e, 0), o = !N(t) || t !== this._$AH && t !== S, o && (this._$AH = t);
    else {
      const a = t;
      let h, c;
      for (t = n[0], h = 0; h < n.length - 1; h++) c = w(this, a[s + h], e, h), c === S && (c = this._$AH[h]), o || (o = !N(c) || c !== this._$AH[h]), c === u ? t = u : t !== u && (t += (c ?? "") + n[h + 1]), this._$AH[h] = c;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Rt extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Dt extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class Lt extends I {
  constructor(t, e, s, i, n) {
    super(t, e, s, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = w(this, t, e, 0) ?? u) === S) return;
    const s = this._$AH, i = t === u && s !== u || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== u && (s === u || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class zt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    w(this, t);
  }
}
const W = U.litHtmlPolyfillSupport;
W == null || W(O, H), (U.litHtmlVersions ?? (U.litHtmlVersions = [])).push("3.3.3");
const jt = (r, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new H(t.insertBefore(T(), n), n, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const y = globalThis;
class E extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = jt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return S;
  }
}
var lt;
E._$litElement$ = !0, E.finalized = !0, (lt = y.litElementHydrateSupport) == null || lt.call(y, { LitElement: E });
const V = y.litElementPolyfillSupport;
V == null || V({ LitElement: E });
(y.litElementVersions ?? (y.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _t = (r) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(r, t);
  }) : customElements.define(r, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const It = { attribute: !0, type: String, converter: L, reflect: !1, hasChanged: Z }, Bt = (r = It, t, e) => {
  const { kind: s, metadata: i } = e;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), n.set(e.name, r), s === "accessor") {
    const { name: o } = e;
    return { set(a) {
      const h = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, h, r, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, r, a), a;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(a) {
      const h = this[o];
      t.call(this, a), this.requestUpdate(o, h, r, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function G(r) {
  return (t, e) => typeof e == "object" ? Bt(r, t, e) : ((s, i, n) => {
    const o = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function gt(r) {
  return G({ ...r, state: !0, attribute: !1 });
}
function ht(r, t) {
  const [e, s, i] = r.split("-").map(Number), n = Date.UTC(e, s - 1, i), o = new Intl.DateTimeFormat("en-US", {
    timeZone: t,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date(n)), a = Object.fromEntries(o.map(({ type: c, value: d }) => [c, d])), h = Date.UTC(
    Number(a.year),
    Number(a.month) - 1,
    Number(a.day),
    Number(a.hour),
    Number(a.minute),
    Number(a.second)
  );
  return n + (n - h);
}
function qt(r, t, e, s, i) {
  const n = ht(t, i), a = ht(e, i) - n;
  if (!Number.isFinite(s) || a <= 0)
    return null;
  const h = r - n;
  return Math.round(h / a * s);
}
var mt = Object.defineProperty, Wt = Object.getOwnPropertyDescriptor, Vt = (r, t, e) => t in r ? mt(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, C = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Wt(t, e) : t, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (i = (s ? o(t, e, i) : o(i)) || i);
  return s && i && mt(t, e, i), i;
}, yt = (r, t, e) => Vt(r, t + "", e);
let k = class extends E {
  constructor() {
    super(...arguments);
    A(this, "hass");
    A(this, "config");
    A(this, "refreshTimer");
  }
  static getConfigElement() {
    return document.createElement("leasing-tracker-card-editor");
  }
  static getStubConfig() {
    return { entity: "", start_date: "", end_date: "", total_km: 0 };
  }
  setConfig(t) {
    if (!t.entity || !t.start_date || !t.end_date || t.total_km === void 0)
      throw new Error("Leasing Tracker Card benötigt Entität, Startdatum, Enddatum und Freikilometer.");
    this.config = {
      type: "custom:leasing-tracker-card",
      entity: t.entity,
      start_date: t.start_date,
      end_date: t.end_date,
      total_km: Number(t.total_km)
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.refreshTimer = window.setInterval(() => this.requestUpdate(), 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.refreshTimer !== void 0 && window.clearInterval(this.refreshTimer);
  }
  render() {
    if (!this.hass || !this.config) return j``;
    const t = this.hass.states[this.config.entity], e = Number(t == null ? void 0 : t.state), s = qt(
      Date.now(),
      this.config.start_date,
      this.config.end_date,
      this.config.total_km,
      this.hass.config.time_zone
    ), i = (t == null ? void 0 : t.attributes.unit_of_measurement) || (this.hass.config.unit_system.length === "km" ? "km" : "mi"), n = (t == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
    return j`
      <ha-card header="Leasing Tracker">
        <div class="content">
          <div class="label">${n}</div>
          <div class="value">${Number.isFinite(e) ? e.toLocaleString() : "Nicht verfügbar"} <span>${i}</span></div>
          <div class="target">
            <span>Sollkilometerstand</span>
            <strong>${s === null ? "Ungültige Daten" : `${s.toLocaleString()} ${i}`}</strong>
          </div>
        </div>
      </ha-card>
    `;
  }
};
yt(k, "styles", dt`
    :host { display: block; }
    .content { padding: 16px; }
    .label { color: var(--secondary-text-color); font-size: 14px; }
    .value { color: var(--primary-text-color); font-size: 32px; font-weight: 600; margin: 8px 0 16px; }
    .value span { font-size: 16px; font-weight: 400; }
    .target { border-top: 1px solid var(--divider-color); display: flex; justify-content: space-between; gap: 16px; padding-top: 12px; }
    .target span { color: var(--secondary-text-color); }
    .target strong { color: var(--primary-text-color); }
  `);
C([
  G({ attribute: !1 })
], k.prototype, "hass", 2);
C([
  gt()
], k.prototype, "config", 2);
k = C([
  _t("leasing-tracker-card")
], k);
let M = class extends E {
  constructor() {
    super(...arguments);
    A(this, "hass");
    A(this, "config", {});
  }
  setConfig(t) {
    this.config = { ...t };
  }
  update(t, e) {
    this.config = { ...this.config, [t]: e }, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config }, bubbles: !0, composed: !0 }));
  }
  render() {
    var e;
    const t = Object.entries(((e = this.hass) == null ? void 0 : e.states) ?? {}).filter(([s]) => s.startsWith("sensor."));
    return j`
      <div class="form">
        <label>Entität aktueller Kilometerstand
          <input list="odometer-entities" .value=${this.config.entity ?? ""} @change=${(s) => this.update("entity", s.target.value)} placeholder="sensor.fahrzeug_kilometerstand" />
          <datalist id="odometer-entities">${t.map(([s, i]) => j`<option value=${s}>${i.attributes.friendly_name ?? s}</option>`)}</datalist>
        </label>
        <label>Leasing-Startdatum
          <input type="date" .value=${this.config.start_date ?? ""} @change=${(s) => this.update("start_date", s.target.value)} />
        </label>
        <label>Leasing-Enddatum
          <input type="date" .value=${this.config.end_date ?? ""} @change=${(s) => this.update("end_date", s.target.value)} />
        </label>
        <label>Freikilometer gesamt
          <input type="number" min="0" step="1" .value=${String(this.config.total_km ?? "")} @change=${(s) => this.update("total_km", Number(s.target.value))} />
        </label>
      </div>
    `;
  }
};
yt(M, "styles", dt`
    .form { display: grid; gap: 16px; }
    label { color: var(--primary-text-color); display: grid; font-size: 14px; gap: 6px; }
    input { background: var(--secondary-background-color); border: 1px solid var(--divider-color); border-radius: 4px; box-sizing: border-box; color: var(--primary-text-color); font: inherit; min-height: 40px; padding: 8px; width: 100%; }
  `);
C([
  G({ attribute: !1 })
], M.prototype, "hass", 2);
C([
  gt()
], M.prototype, "config", 2);
M = C([
  _t("leasing-tracker-card-editor")
], M);
window.customCards = [
  ...window.customCards ?? [],
  { type: "leasing-tracker-card", name: "Leasing Tracker Card", description: "Zeigt aktuellen und zeitbasierten Sollkilometerstand." }
];
export {
  k as LeasingTrackerCard,
  M as LeasingTrackerCardEditor
};
//# sourceMappingURL=leasing-tracker-card.js.map
