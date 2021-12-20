
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const iconOK = "data:image/png;base64,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";
    const iconAvatar = 'data:image/png;base64,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';

    function random_id() {
      return (
        Number(String(Math.random()).slice(2)) + 
        Date.now() + 
        Math.round(performance.now())
      ).toString(36);
    }

    /* src\App.svelte generated by Svelte v3.44.3 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    // (109:3) {#if messages.length !== 0}
    function create_if_block(ctx) {
    	let each_1_anchor;
    	let each_value = /*messages*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Date, messages, msgRef*/ 17) {
    				each_value = /*messages*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(109:3) {#if messages.length !== 0}",
    		ctx
    	});

    	return block;
    }

    // (114:5) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let div0;
    	let p0;
    	let t0_value = new Date(/*message*/ ctx[20].date).toLocaleString() + "";
    	let t0;
    	let t1;
    	let p1;
    	let t2_value = /*message*/ ctx[20].msg + "";
    	let t2;
    	let div0_class_value;
    	let t3;
    	let div1_data_align_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(p0, "class", "msg-data");
    			add_location(p0, file, 118, 8, 3867);
    			attr_dev(p1, "class", "msg-text");
    			add_location(p1, file, 119, 8, 3943);

    			attr_dev(div0, "class", div0_class_value = /*message*/ ctx[20].from
    			? 'chat_field-messagefrom'
    			: 'chat_field-messageto');

    			add_location(div0, file, 117, 7, 3777);
    			attr_dev(div1, "class", "chat_field-message");
    			attr_dev(div1, "data-align", div1_data_align_value = /*message*/ ctx[20].from ? 'from' : 'to');
    			add_location(div1, file, 114, 6, 3650);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(p1, t2);
    			append_dev(div1, t3);
    			/*div1_binding*/ ctx[10](div1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 16 && t0_value !== (t0_value = new Date(/*message*/ ctx[20].date).toLocaleString() + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*messages*/ 16 && t2_value !== (t2_value = /*message*/ ctx[20].msg + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*messages*/ 16 && div0_class_value !== (div0_class_value = /*message*/ ctx[20].from
    			? 'chat_field-messagefrom'
    			: 'chat_field-messageto')) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*messages*/ 16 && div1_data_align_value !== (div1_data_align_value = /*message*/ ctx[20].from ? 'from' : 'to')) {
    				attr_dev(div1, "data-align", div1_data_align_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*div1_binding*/ ctx[10](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(114:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (111:5) {#if (message.msg === "manager is OFFLINE..." ||          message.msg === "manager is ONLINE...")}
    function create_if_block_1(ctx) {
    	let div;
    	let t0_value = /*message*/ ctx[20].msg + "";
    	let t0;
    	let t1;
    	let t2_value = new Date(/*message*/ ctx[20].date).toLocaleString() + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			attr_dev(div, "class", "service");
    			add_location(div, file, 112, 8, 3546);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 16 && t0_value !== (t0_value = /*message*/ ctx[20].msg + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*messages*/ 16 && t2_value !== (t2_value = new Date(/*message*/ ctx[20].date).toLocaleString() + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(111:5) {#if (message.msg === \\\"manager is OFFLINE...\\\" ||          message.msg === \\\"manager is ONLINE...\\\")}",
    		ctx
    	});

    	return block;
    }

    // (110:4) {#each messages as message }
    function create_each_block(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*message*/ ctx[20].msg === "manager is OFFLINE..." || /*message*/ ctx[20].msg === "manager is ONLINE...") return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(110:4) {#each messages as message }",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let section0;
    	let picture;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div2;
    	let div0;
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let t4;
    	let section1;
    	let div3;
    	let t5;
    	let footer;
    	let div4;
    	let input;
    	let t6;
    	let img1;
    	let img1_src_value;
    	let mounted;
    	let dispose;
    	let if_block = /*messages*/ ctx[4].length !== 0 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			section0 = element("section");
    			picture = element("picture");
    			img0 = element("img");
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t1 = text(/*title*/ ctx[1]);
    			t2 = space();
    			div1 = element("div");
    			t3 = text(/*desc*/ ctx[2]);
    			t4 = space();
    			section1 = element("section");
    			div3 = element("div");
    			if (if_block) if_block.c();
    			t5 = space();
    			footer = element("footer");
    			div4 = element("div");
    			input = element("input");
    			t6 = space();
    			img1 = element("img");
    			attr_dev(img0, "class", "cp_header-avatarimg");
    			if (!src_url_equal(img0.src, img0_src_value = /*avatar*/ ctx[3])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "avatar");
    			add_location(img0, file, 99, 3, 3086);
    			attr_dev(picture, "class", "cp_header-avatar");
    			add_location(picture, file, 98, 2, 3047);
    			attr_dev(div0, "class", "cp_header-card-1");
    			add_location(div0, file, 102, 3, 3196);
    			attr_dev(div1, "class", "cp_header-card-2");
    			add_location(div1, file, 103, 3, 3244);
    			attr_dev(div2, "class", "cp_header-card");
    			add_location(div2, file, 101, 2, 3163);
    			attr_dev(section0, "class", "cp_header");
    			add_location(section0, file, 97, 1, 3016);
    			attr_dev(div3, "class", "chat_field");
    			add_location(div3, file, 107, 2, 3341);
    			attr_dev(section1, "class", "cp_body");
    			add_location(section1, file, 106, 1, 3312);
    			attr_dev(input, "class", "chat_input-text");
    			attr_dev(input, "name", "question");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", /*placeholderStr*/ ctx[6]);
    			add_location(input, file, 129, 3, 4129);
    			attr_dev(img1, "class", "chat_input-icon");
    			if (!src_url_equal(img1.src, img1_src_value = iconOK)) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "OK");
    			add_location(img1, file, 133, 3, 4296);
    			attr_dev(div4, "class", "chat_input");
    			add_location(div4, file, 128, 2, 4100);
    			attr_dev(footer, "class", "cp_footer");
    			add_location(footer, file, 127, 1, 4070);
    			attr_dev(main, "class", "cp");
    			attr_dev(main, "id", "App");
    			add_location(main, file, 96, 0, 2987);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, section0);
    			append_dev(section0, picture);
    			append_dev(picture, img0);
    			append_dev(section0, t0);
    			append_dev(section0, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    			append_dev(main, t4);
    			append_dev(main, section1);
    			append_dev(section1, div3);
    			if (if_block) if_block.m(div3, null);
    			append_dev(main, t5);
    			append_dev(main, footer);
    			append_dev(footer, div4);
    			append_dev(div4, input);
    			set_input_value(input, /*inputVal*/ ctx[5]);
    			append_dev(div4, t6);
    			append_dev(div4, img1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[11]),
    					listen_dev(input, "keypress", /*onKeyPress*/ ctx[8], false, false, false),
    					listen_dev(img1, "click", /*sendMessage*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*avatar*/ 8 && !src_url_equal(img0.src, img0_src_value = /*avatar*/ ctx[3])) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (dirty & /*title*/ 2) set_data_dev(t1, /*title*/ ctx[1]);
    			if (dirty & /*desc*/ 4) set_data_dev(t3, /*desc*/ ctx[2]);

    			if (/*messages*/ ctx[4].length !== 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*inputVal*/ 32 && input.value !== /*inputVal*/ ctx[5]) {
    				set_input_value(input, /*inputVal*/ ctx[5]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const { hostname, protocol: httpPrefix } = window.location;
    	const wsPrefix = httpPrefix === 'http:' ? 'ws:' : 'wss:';
    	const URL = `${httpPrefix}//${hostname}:5001`;
    	const WS_URL = `${wsPrefix}//${hostname}:5001/ws`;

    	let placeholderStr = 'type your question ...',
    		title = 'FAKE CORP.',
    		desc = 'Manager',
    		avatar = iconAvatar,
    		messages = [],
    		ws = null,
    		inputVal = '',
    		msgRef,
    		Session;

    	const receiveMessage = message => {
    		$$invalidate(4, messages = [...messages, message]);
    		$$invalidate(9, Session.userMSGS = messages, Session);
    		sessionStorage.setItem('tchat', JSON.stringify(Session));
    	};

    	const sendMessage = () => {
    		if (inputVal !== '') {
    			let message = new MessageObj(inputVal);
    			ws.send(JSON.stringify(message));
    			$$invalidate(5, inputVal = '');
    			$$invalidate(4, messages = [...messages, message]);
    			$$invalidate(9, Session.userMSGS = messages, Session);
    			sessionStorage.setItem('tchat', JSON.stringify(Session));
    		}
    	};

    	const onKeyPress = e => {
    		if (e.charCode === 13) sendMessage();
    	};

    	function MessageObj(msg) {
    		this.from = Session.userID;
    		this.msg = msg;
    		this.date = Date.now();
    	}

    	onMount(async () => {
    		$$invalidate(9, Session = JSON.parse(sessionStorage.getItem('tchat')) || {});

    		if (Object.entries(Session).length === 0) {
    			$$invalidate(9, Session.userID = random_id(), Session);

    			let url = window.location != window.parent.location
    			? document.referrer
    			: document.location.href; // ---- https://tele.scope.cf
    			// ---- https://tchat.scope.cf:5001/tchat

    			$$invalidate(9, Session.userHOST = url.split(':')[1].split('/')[2], Session);
    			let response = await fetch(`${URL}/api/auth/usersite/${Session.userHOST}`).then(response => response.json()).catch(e => console.log('response...', e));

    			if (!response.message) {
    				$$invalidate(9, { avatar: Session.userAvatar, greeting: Session.userGreeting, title: Session.userTitle, desc: Session.userDesc } = response, Session);
    			}

    			$$invalidate(
    				9,
    				Session.userMSGS = [
    					{
    						to: 'me',
    						msg: Session.userGreeting,
    						date: Date.now()
    					}
    				],
    				Session
    			);

    			$$invalidate(4, messages = Session.userMSGS);
    			sessionStorage.setItem('tchat', JSON.stringify(Session));
    		} else {
    			$$invalidate(4, messages = Session.userMSGS);
    		}

    		ws = new WebSocket(`${WS_URL}?userName=${Session.userID}&userHost=${Session.userHOST}`);

    		ws.onmessage = event => {
    			receiveMessage(JSON.parse(event.data));
    		};

    		ws.onopen = () => {
    			ws.send(JSON.stringify({
    				'newClientConnection': Session.userID,
    				'msg': 'initial connection...',
    				'date': Date.now()
    			}));
    		};
    	});

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			msgRef = $$value;
    			$$invalidate(0, msgRef);
    		});
    	}

    	function input_input_handler() {
    		inputVal = this.value;
    		$$invalidate(5, inputVal);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		iconAvatar,
    		iconOK,
    		random_id,
    		hostname,
    		httpPrefix,
    		wsPrefix,
    		URL,
    		WS_URL,
    		placeholderStr,
    		title,
    		desc,
    		avatar,
    		messages,
    		ws,
    		inputVal,
    		msgRef,
    		Session,
    		receiveMessage,
    		sendMessage,
    		onKeyPress,
    		MessageObj
    	});

    	$$self.$inject_state = $$props => {
    		if ('placeholderStr' in $$props) $$invalidate(6, placeholderStr = $$props.placeholderStr);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('desc' in $$props) $$invalidate(2, desc = $$props.desc);
    		if ('avatar' in $$props) $$invalidate(3, avatar = $$props.avatar);
    		if ('messages' in $$props) $$invalidate(4, messages = $$props.messages);
    		if ('ws' in $$props) ws = $$props.ws;
    		if ('inputVal' in $$props) $$invalidate(5, inputVal = $$props.inputVal);
    		if ('msgRef' in $$props) $$invalidate(0, msgRef = $$props.msgRef);
    		if ('Session' in $$props) $$invalidate(9, Session = $$props.Session);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*msgRef*/ 1) {
    			if (msgRef) msgRef.scrollIntoView({ behavior: 'smooth' });
    		}

    		if ($$self.$$.dirty & /*Session*/ 512) {
    			if (Session?.userAvatar) $$invalidate(3, avatar = Session.userAvatar);
    		}

    		if ($$self.$$.dirty & /*Session*/ 512) {
    			if (Session?.userTitle) $$invalidate(1, title = Session.userTitle);
    		}

    		if ($$self.$$.dirty & /*Session*/ 512) {
    			if (Session?.userDesc) $$invalidate(2, desc = Session.userDesc);
    		}
    	};

    	return [
    		msgRef,
    		title,
    		desc,
    		avatar,
    		messages,
    		inputVal,
    		placeholderStr,
    		sendMessage,
    		onKeyPress,
    		Session,
    		div1_binding,
    		input_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
